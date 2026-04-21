import React from 'react'

const ServiceComp = () => {
    const services = [
        {
            name: "Easy Booking",
            description: "Schedule your health checkup quickly online.",
            image: "https://media.istockphoto.com/id/1394627722/photo/booking-meeting-calendar-appointment.webp?a=1&b=1&s=612x612&w=0&k=20&c=OSsmNCbOy-E5C_Hycy5FQZW5aKtNJSWrwIYn9QrK2ao="
        },
        {
            name: "Professional Tests",
            description: "Access reliable medical tests from trusted clinics.",
            image: "https://media.istockphoto.com/id/2202294534/photo/doctors-touch-virtual-patient-medical-reports-to-diagnose-diseases-and-plan-treatment-more.webp?a=1&b=1&s=612x612&w=0&k=20&c=lXj1vpmEeMvqTEag2KrQ-GyFwkMuCnC7j9L16iEVWoQ="
        },
        {
            name: "Fast Results",
            description: "Get quick and accurate results from your checkup.",
            image: "https://media.istockphoto.com/id/2187343431/photo/young-smiling-man-sitting-on-a-bench-on-the-street-and-resting-after-jogging-and-sports.jpg?s=612x612&w=0&k=20&c=gKSUDYnuHYKcXczoOG3qUpIY3mqWRSQ1vFRyJIXusQM="
        }
    ]
    return (
        <section className='bg-blue-50 p-20'>
            <div className='text-center'>
                <h1 className='font-bold text-2xl pt-10'>About Our Service</h1>
                <p className='text-lg'>Our platform helps users book medical checkups easily and choose from different health packages for better health monitoring.</p>
            </div>

            <div className='flex space-x-5 justify-center p-5'>
                {services.map((service) => {
                    return(<div key={service.id} className='rounded-lg shadow-xl p-4 w-100 bg-white border-l-2 border-blue-800'>
                    <img src={service.image} alt={service.name} className='object-cover rounded' />
                        <p className='font-bold text-xl'>{service.name} </p>
                        <p>{service.description}</p>
                </div>)
                })}
            </div>
        </section>
    )
}

export default ServiceComp