export type BasePictureType = {
  id: string;
  userId: string;
  imageUrl: string;
  isDeletable: boolean;
};

export type PreviewPictureType = {
  tag: string;
  previewImageUrl: string;
};
