// import { prisma } from '@/lib/prisma'

// export default async function Home() {
//   const services = await prisma.service.findMany({ orderBy: { name: 'asc' } })
//   const industries = await prisma.industry.findMany({ orderBy: { name: 'asc' } })

//   return (
//     <main style={{ padding: '2rem' }}>
//       <h1>ABC Technologies</h1>
//       <p>Helping businesses grow online through websites, apps, and digital marketing.</p>
//       <a href="/contact">Get a Free Quote</a>

//       <h2>Our Services</h2>
//       <ul>
//         {services.map((s) => (
//           <li key={s.id}><a href={`/services/${s.slug}`}>{s.name}</a></li>
//         ))}
//       </ul>

//       <h2>Industries We Serve</h2>
//       <ul>
//         {industries.map((i) => (
//           <li key={i.id}><a href={`/industries/${i.slug}`}>{i.name}</a></li>
//         ))}
//       </ul>

//       <h2>Why Choose Us</h2>
//       <p>We combine technical expertise with a results-driven approach to help your business succeed online.</p>
//     </main>
//   )
// }
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero/Hero";
import About from "@/components/home/About/About";
import Services from "@/components/home/Services/Services";
import Portfolio from "@/components/home/Portfolio/Portfolio";
import Process from "@/components/sections/process/Process";

import { getServices } from "@/repositories/service.repository";
import { getPortfolio } from "@/repositories/portfolio.repository";

export default async function Home() {
   const [services, portfolio] = await Promise.all([
    getServices(),
    getPortfolio(),
  ]);   

  return (
    <>
      <Navbar />

      <Hero />

      <About />

      <Services services={services} />
      <Process />

      <Portfolio portfolio={portfolio} />
    </>
  );
}