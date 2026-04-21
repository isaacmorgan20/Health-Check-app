import React from 'react'

const HealthPack = () => {
    const packages = [
        {
            title: "Basic Health Check",
            type: "Basic health screening",
            price: 150,
            image: "https://media.istockphoto.com/id/2218488257/photo/top-view-of-white-desk-with-medical-equipment.webp?a=1&b=1&s=612x612&w=0&k=20&c=SqNTiHlhneStUsZa1W02GU6hkpBVN1WwoqrmeWyUo5g="
        },
        {
            title: "Full Body Check",
            type: "Complete body test",
            price: 400,
            image: "https://plus.unsplash.com/premium_photo-1726797701580-028ecd5cb189?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZnVsbCUyMGJvZHklMjBjaGVja3VwfGVufDB8fDB8fHww"
        },
        {
            title: "Diebetes Screening",
            type: "Blood Suger Test",
            price: 200,
            image: "https://media.istockphoto.com/id/1180743974/photo/doctor-writing-word-diabetes-with-marker-medical-concept.webp?a=1&b=1&s=612x612&w=0&k=20&c=TqZq2yhfUw_ifaegtCR7TRJU6jYBLzn33qqIU96QGnI="
        },
        {
            title: "Hearth Check",
            type: "Hearth Health Test",
            price: 300,
            image: "https://plus.unsplash.com/premium_photo-1718349374495-b1d09644f973?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fEhlYXJ0aCUyMENoZWNrdXB8ZW58MHx8MHx8fDA%3D"
        }
    ]
    return (
        <section className='p-10'>
            <div className='text-center'>
                <h1 className='font-bold text-2xl pt-10'>Featured Health Packages</h1>
                <p className='text-lg'>Choose from our most popular health checkup packages designed to help you stay healthy.</p>
            </div>

            <div className='flex space-x-5 justify-center p-5'>
                {packages.map((item) => {
                    return (<div key={item.id} className='rounded-lg shadow-xl p-4 w-100 bg-white border-l-2 border-blue-800'>
                        <img src={item.image} alt={item.name} className='object-cover rounded' />
                        <h1 className='font-bold text-xl'>{item.title}</h1>
                        <h2>{item.type}</h2>
                        <h3>{item.price}</h3>
                        <button className='text-white rounded-lg bg-blue-900 p-3 hover:bg-blue-800'>Book now</button>
                    </div>)
                })}
            </div>
        </section>
    )
}

export default HealthPack