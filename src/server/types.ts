import type {EngagementInviteProps} from '../templates/engagement/model';

export type ProjectRecord = {
  id: string;
  templateId: 'engagement-invite';
  templateVersion: 1;
  props: EngagementInviteProps;
  createdAt: string;
  updatedAt: string;
};

export type RenderJobStatus = 'queued' | 'rendering' | 'completed' | 'failed';

export type RenderJob = {
  id: string;
  projectId: string;
  templateId: 'engagement-invite';
  templateVersion: 1;
  propsSnapshot: EngagementInviteProps;
  status: RenderJobStatus;
  progress: number;
  outputUrl: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};
