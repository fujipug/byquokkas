import { generateToken } from "../utils/functions";

export const getPickassoNfts = async (address: string) => {
  let result: any = [];
  await fetch(
    `https://api.pickasso.net/v1/wallet/${address}/tokens?count=1000&sortBy=updatedBlock&sortOrder=desc&verified=false`,
    {
      headers: {
        'x-api-token': generateToken(),
      }
    },
  ).then((response) => {
    if (!response.ok) {
      throw new Error('Something wrong happened');
    }

    return response.json();
  }).then((data) => {
    result = data.docs;
  }).catch((e) => {
    console.log('fetch inventory error', e);
  });

  return result;
}