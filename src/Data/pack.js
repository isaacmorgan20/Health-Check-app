const packs = [
    {
        id: 1,
        name: "Basic Health Check",
        description: "General body checkup including blood pressure and weight check.",
        price: 150,
        image: "https://images.unsplash.com/photo-1666887360680-9dc27a1d2753?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QmFzaWMlMjBIZWFsdGglMjBDaGVja3xlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        id: 2,
        name: "Full Body Check",
        description: "Complete body examination with blood tests and organ screening.",
        price: 400,
        image: "https://images.unsplash.com/photo-1764314399496-aa49b4e4d127?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8RnVsbCUyMEJvZHklMjBDaGVjay11cHxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        id: 3,
        name: "Diabetes Screening",
        description: "Blood sugar testing and diabetes risk assessment.",
        price: 200,
        image: "https://images.unsplash.com/photo-1624454002429-40ed87a5ec04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RGlhYmV0ZXMlMjBTY3JlZW5pbmd8ZW58MHx8MHx8fDA%3D"
    },
    {
        id: 4,
        name: "Heart Check",
        description: "Heart health evaluation including ECG and blood pressure tests.",
        price: 250,
        image: "https://plus.unsplash.com/premium_photo-1718349373623-6615241d1d2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SGVhcnQlMjBDaGVja3xlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        id: 5,
        name: "Eye Examination",
        description: "Comprehensive eye testing and vision assessment.",
        price: 120,
        image: "https://plus.unsplash.com/premium_photo-1677333508737-6b6d642bc6d6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RXllJTIwRXhhbWluYXRpb258ZW58MHx8MHx8fDA%3D"
    },
    {
        id: 6,
        name: "Dental Checkup",
        description: "Routine dental examination and oral health assessment.",
        price: 180,
        image: "https://images.unsplash.com/photo-1626736985932-c0df2ae07a2e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fERlbnRhbCUyMENoZWNrdXB8ZW58MHx8MHx8fDA%3D"
    },
    {
        id: 7,
        name: "Pregnancy Checkup",
        description: "Prenatal health monitoring and pregnancy screening.",
        price: 300,
        image: "https://media.istockphoto.com/id/1257601987/photo/happy-pregnant-woman-holding-pregnancy-test-examine-positive-test-young-lady-has-baby-or.webp?a=1&b=1&s=612x612&w=0&k=20&c=em2u12mzzEP8C3vx2ty7y6OXsmTOm23lvDafpvm7g5k="
    },
    {
        id: 8,
        name: "Blood Test Package",
        description: "Complete blood count and laboratory analysis.",
        price: 170,
        image: "https://images.unsplash.com/photo-1542884841-9f546e727bca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Qmxvb2QlMjBUZXN0JTIwUGFja2FnZXxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        id: 9,
        name: "Cancer Screening",
        description: "Early detection tests for common cancer risks.",
        price: 500,
        image: "https://media.istockphoto.com/id/2190716573/photo/experienced-radiographer-examines-chest-x-rays-on-multiple-computer-monitors-in-a-dark.webp?a=1&b=1&s=612x612&w=0&k=20&c=PArk9NIJjkLw_kUN50G3xRUANULfh2wGBo1ec9j1C00="
    },
    {
        id: 10,
        name: "Kidney Function Test",
        description: "Tests to evaluate kidney health and performance.",
        price: 280,
        image: "https://media.istockphoto.com/id/1282360256/photo/patient-kidney-diagnosis-and-treatment-concept.webp?a=1&b=1&s=612x612&w=0&k=20&c=jnGju1tQzorG2uezyTl9K5oxuGTBwkPPrqEnQPbJlFc="
    },
    {
        id: 11,
        name: "Liver Function Test",
        description: "Liver health monitoring and medical assessment",
        price: 260,
        image: "https://plus.unsplash.com/premium_photo-1723008051623-6180656c4cd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8TGl2ZXIlMjBGdW5jdGlvbiUyMFRlc3R8ZW58MHx8MHx8fDA%3D"
    },
    {
        id: 12,
        name: "Malaria Test Package",
        description: "Malaria diagnosis and treatment consultation",
        price: 80,
        image: "https://media.istockphoto.com/id/1686552567/photo/strip-test.webp?a=1&b=1&s=612x612&w=0&k=20&c=m5lRk869x2sRnEQQxJOaKVXQzaYY4Dx8mGyvNSDwJYQ="
    },
]

export default packs