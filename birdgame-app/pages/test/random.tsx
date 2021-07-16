import React from 'react'
import { Layout } from '../../components/Layout'
import { Bird, getImageBirds } from '../../data/levels'

export default function Home() {

    const levelOne = getImageBirds(1)
    return (
        <Layout>
            {levelOne.map((b: Bird) =>
                <div className='p-4'>{b.name}</div>)}



        </Layout>
    )
}
