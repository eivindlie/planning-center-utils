import { ISong } from "types";
import { IApiSong } from "types/contractTypes";
import { get } from "utils/crud";

const BASE_URL = "https://api.planningcenteronline.com/services/v2";

export const getSongs = async (): Promise<ISong[]> => {
  const result = (await get(`${BASE_URL}/songs`)) as IApiSong[];

  return result.map(mapSong);
};

const mapSong = (song: IApiSong): ISong => {
  return {
    id: song.id,
    title: song.attributes.title,
    author: song.attributes.author,
    ccliNumber: song.attributes.ccli_number,
    copyright: song.attributes.copyright,
    lastScheduledAt: song.attributes.last_scheduled_at
      ? new Date(song.attributes.last_scheduled_at)
      : undefined,
  };
};
