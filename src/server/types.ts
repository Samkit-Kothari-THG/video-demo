import type {
  InvitationTemplateId,
  InvitationTemplateVersion,
} from '../templates/catalog';
import type {InvitationContentProps} from '../templates/engagement/model';

export type ProjectRecord = {
  id: string;
  templateId: InvitationTemplateId;
  templateVersion: InvitationTemplateVersion;
  props: InvitationContentProps;
  createdAt: string;
  updatedAt: string;
};

export type RenderJobStatus = 'queued' | 'rendering' | 'completed' | 'failed';

export type RenderJob = {
  id: string;
  projectId: string;
  templateId: InvitationTemplateId;
  templateVersion: InvitationTemplateVersion;
  propsSnapshot: InvitationContentProps;
  status: RenderJobStatus;
  progress: number;
  outputUrl: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};
