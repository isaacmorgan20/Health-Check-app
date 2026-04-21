import React from 'react'
const steps = [
    {
        step: "01",
        title: "Choose a Health Package",
        description: "Browse available health packages and select the one that fits your needs."
    },
    {
        step: "02",
        title: "Book an Appointment",
        description: "Fill in your details and choose a convenient date for your checkup."
    },
    {
        step: "03",
        title: "Visit the Clinic",
        description: "Come to the clinic on your selected date to complete your health checkup."
    }
];



const Works = () => {
    return (
        <section className='bg-blue-50 p-20'>
            <h1 className='text-center'>How it Works</h1>
            <h2 className='text-center'>Follow these simple steps to book your health checkup.</h2>

            <div className='flex space-x-5 justify-center p-5'>
                {steps.map((item) => {
                    return (
                        <div key={item.id} className='rounded-lg shadow-xl p-4 w-100 bg-white border-l-2 border-blue-800 '>
                            <h1>{item.step}</h1>
                            <h1>{item.title}</h1>
                            <h1>{item.description}</h1>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default Works