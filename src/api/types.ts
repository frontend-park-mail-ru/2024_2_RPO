export interface BoardContentResponse {
  boardInfo: BoardInfoResponse;
}
export interface BoardInfoResponse{
    id: number;
    name: string;
    description: string;
    //TODO background
}
