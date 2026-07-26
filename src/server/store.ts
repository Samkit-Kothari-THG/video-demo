import {randomUUID} from 'node:crypto';
import {mkdir, readFile, rename, writeFile} from 'node:fs/promises';
import path from 'node:path';
import type {RenderJob, ProjectRecord} from './types';

const dataDirectory = path.join(process.cwd(), '.data');
const projectsFile = path.join(dataDirectory, 'projects.json');
const renderJobsFile = path.join(dataDirectory, 'render-jobs.json');
let writeQueue: Promise<void> = Promise.resolve();

const withWriteLock = async <T>(operation: () => Promise<T>) => {
  const result = writeQueue.then(operation, operation);
  writeQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
};

const readCollection = async <T>(file: string): Promise<T[]> => {
  try {
    const content = await readFile(file, 'utf8');
    const parsed = JSON.parse(content) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const writeCollection = async <T>(file: string, records: T[]) => {
  await mkdir(dataDirectory, {recursive: true});
  const temporaryFile = `${file}.${randomUUID()}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(records, null, 2), 'utf8');
  await rename(temporaryFile, file);
};

const now = () => new Date().toISOString();

export const listProjects = async () => {
  const projects = await readCollection<ProjectRecord>(projectsFile);
  return projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
};

export const getProject = async (id: string) => {
  const projects = await readCollection<ProjectRecord>(projectsFile);
  return projects.find((project) => project.id === id) ?? null;
};

export const createProject = async (props: ProjectRecord['props']) => {
  return withWriteLock(async () => {
    const timestamp = now();
    const project: ProjectRecord = {
      id: randomUUID(),
      templateId: 'engagement-invite',
      templateVersion: 1,
      props,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const projects = await readCollection<ProjectRecord>(projectsFile);
    await writeCollection(projectsFile, [project, ...projects]);
    return project;
  });
};

export const updateProject = async (
  id: string,
  updates: Partial<ProjectRecord['props']>,
) => {
  return withWriteLock(async () => {
    const projects = await readCollection<ProjectRecord>(projectsFile);
    const index = projects.findIndex((project) => project.id === id);
    if (index === -1) {
      return null;
    }

    const project: ProjectRecord = {
      ...projects[index],
      props: {...projects[index].props, ...updates},
      updatedAt: now(),
    };
    projects[index] = project;
    await writeCollection(projectsFile, projects);
    return project;
  });
};

export const createRenderJob = async (
  project: ProjectRecord,
): Promise<RenderJob> => {
  return withWriteLock(async () => {
    const timestamp = now();
    const job: RenderJob = {
      id: randomUUID(),
      projectId: project.id,
      templateId: project.templateId,
      templateVersion: project.templateVersion,
      propsSnapshot: project.props,
      status: 'queued',
      progress: 0,
      outputUrl: null,
      error: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const jobs = await readCollection<RenderJob>(renderJobsFile);
    await writeCollection(renderJobsFile, [job, ...jobs]);
    return job;
  });
};

export const getRenderJob = async (id: string) => {
  const jobs = await readCollection<RenderJob>(renderJobsFile);
  return jobs.find((job) => job.id === id) ?? null;
};

export const updateRenderJob = async (
  id: string,
  updates: Partial<Omit<RenderJob, 'id' | 'projectId' | 'createdAt'>>,
) => {
  return withWriteLock(async () => {
    const jobs = await readCollection<RenderJob>(renderJobsFile);
    const index = jobs.findIndex((job) => job.id === id);
    if (index === -1) {
      return null;
    }

    const job: RenderJob = {
      ...jobs[index],
      ...updates,
      updatedAt: now(),
    };
    jobs[index] = job;
    await writeCollection(renderJobsFile, jobs);
    return job;
  });
};
