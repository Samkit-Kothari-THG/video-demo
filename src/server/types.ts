import type {
  InvitationTemplateId,
  InvitationTemplateVersion,
} from '../templates/catalog';
import type {InvitationContentProps} from '../templates/engagement/model';
import type {
  InvitationExportType,
  InvitationFormat,
} from '../templates/formats';

export type ProjectRecord = {
  id: string;
  templateId: InvitationTemplateId;
  templateVersion: InvitationTemplateVersion;
  format: InvitationFormat;
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
  format: InvitationFormat;
  exportType: InvitationExportType;
  propsSnapshot: InvitationContentProps;
  status: RenderJobStatus;
  progress: number;
  outputUrl: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};
