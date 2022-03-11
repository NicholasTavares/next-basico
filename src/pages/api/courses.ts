import { NextApiRequest, NextApiResponse } from "next"

/* eslint-disable import/no-anonymous-default-export */
export default (request: NextApiRequest, response: NextApiResponse) => {
  const courses = [
    {id: 1, name: 'NextJS com TypeScript'},
    {id: 2, name: 'React.js com TypeScript'},
    {id: 3, name: 'Node.js com TypeScript'},
    {id: 4, name: 'SASS'},
    {id: 4, name: 'Styled Components  '}
  ]

  return response.json(courses)
}
