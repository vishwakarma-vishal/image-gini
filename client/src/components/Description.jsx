import React from 'react'
import { assets } from '../assets/assets'

const Description = () => {
  return (
    <div className='flex flex-col items-center justify-center my-24 
    p-6' >
        <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>Create AI Images</h1>
        <p className='text-gray-500 mb-8'>Turn your imagination into visuals</p>
    
        <div className='flex flex-col gap-5 lg:gap-8 
        md:flex-row items-center justify-between'>
            <img src={assets.sample_img_1} alt='' 
            className='w-80 xl:w-96 rounded-lg'/>
            <div>
            <h2 className='text-3xl font-medium max-w-lg mb-4'>Introducing the AI-Powered Text to Image 
            Generator</h2>
            <p className='text-ray-600 mb-4'>Easily bring your 
                ideas to life with our free AI image generator. Whether
                you need stunning viuals or unique imager, our tool 
                Transforms your text Into eye-catching images with just 
                a few clicks. Imgine it, describe it,and watch it 
                come to life instantly.
            </p>
            <p className='text-gray-600'>
                Simply type in a text prompt,and our cutting-edge AI will geneate high-quality images in seconds.
                from product visuals to charactor designs and portraits,
                even concepts that don't yet exist can be visualized 
                effortlessly. Powered by advanced AI technology, the 
                creative possibilities are limitless!

            </p>
            
            </div>
        </div>
    </div>
  )
}

export default Description