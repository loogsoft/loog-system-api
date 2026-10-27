export type InstagramAccountDto = {
  id: string;
  username: string;
  name?: string;
  account_type: string;
};

export type InstagramMediaResponseDto = {
  id: string;
};

export type InstagramMediaStatusDto = {
  id: string;
  status_code: 'IN_PROGRESS' | 'FINISHED' | 'ERROR' | 'EXPIRED' | 'PUBLISHED';
};
