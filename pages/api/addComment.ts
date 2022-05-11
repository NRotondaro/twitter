import type { NextApiRequest, NextApiResponse } from 'next'
import { Comment } from '../../typings'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const comment: Comment = JSON.parse(req.body)

  const mutations = {
    mutations: [
      {
        create: {
          _type: 'comment',
          comment: comment.comment,
          username: comment.username,
          profileImg: comment.profileImg,
          tweet: {
            _type: 'reference',
            _ref: comment.tweetId,
          },
        },
      },
    ],
  }

  const apiEndpoint = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`

  const result = await fetch(apiEndpoint, {
    headers: {
      'content-type': 'aplication/json',
      Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
    },
    body: JSON.stringify(mutations),
    method: 'POST',
  }).then((res) => res.json())
  .catch((error) => console.log(error))

  res.status(200).json({ name: 'Comment Added!' })
}
