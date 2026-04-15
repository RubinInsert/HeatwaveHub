import Link from "next/link";
import { ArrowLeftIcon, ArrowTrendingUpIcon, UserGroupIcon, MapPinIcon } from "@heroicons/react/24/outline";
import PageNavigation from "../components/PageNavigation";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Individual A",
      role: "Role A",
      affiliation: "University of A",
    },
    {
      name: "Individual B",
      role: "Role B",
      affiliation: "University of B",
    },
    {
      name: "Individual C",
      role: "Role C",
      affiliation: "University of C",
    },
    {
      name: "Individual D",
      role: "Role D",
      affiliation: "University of D",
    },
    {
      name: "Individual E",
      role: "Role E",
      affiliation: "University of E",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <PageNavigation href="/" label="About the Heatwave Hub" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Building Resilience to Heatwaves in Regional NSW
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl">
            A University of Newcastle-led research project funded by the Australian Government's Disaster Ready Fund, working to improve preparedness for the escalating heatwave threats in New South Wales.
          </p>
        </div>
      </section>

      {/* Project Overview */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 Items-start">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Project Overview</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                Heatwaves are Australia’s deadliest natural hazard, and their frequency, duration, and intensity are increasing under climate change. The Heatwave Hub, funded by the Disaster Ready Fund aims to improve understanding of where and why communities are most at risk from extreme heat and to support targeted adaptation and resilience planning across New South Wales (NSW).
              </p>
              <p>
                Using advanced geospatial analysis and modeling, the project will identify vulnerable populations, assess current and future heat risks, and pinpoint best practices for heatwave adaptation. Collaboration with Local Government Areas (LGAs) ensures that councils can integrate heatwave resilience into urban planning and service delivery.
              </p>
              <p>
                Through interviews, focus groups, and co-design workshops, stakeholders will collaboratively identify gaps, share experiences, and develop locally relevant strategies. By combining data-driven insights with participatory approaches, the Heatwave Hub empowers communities, strengthens planning and service delivery, and helps reduce the health and social impacts of increasingly frequent and intense heatwaves.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <h4 className="text-xl font-bold text-gray-900 mb-6">Funding & Timeline</h4>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-semibold text-gray-500 uppercase">Total Funding</dt>
                <dd className="text-3xl font-black text-orange-600">$1.3M</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-gray-500 uppercase">Duration</dt>
                <dd className="text-lg font-semibold text-gray-900">3 Years</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-gray-500 uppercase">Funder</dt>
                <dd className="text-gray-900">Australian Government<br />Disaster Ready Fund</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-gray-500 uppercase">Lead Institution</dt>
                <dd className="text-gray-900">University of Newcastle</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-10">What the Hub Delivers</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <MapPinIcon className="w-12 h-12 text-orange-600 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-3">Risk Assessment & Mapping</h4>
              <p className="text-gray-700">
                Interactive map ranking NSW LGAs by their current and future heatwave risk using the Combined Heatwave Risk Index (CHRI).
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <ArrowTrendingUpIcon className="w-12 h-12 text-orange-600 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-3">Preparedness Planning</h4>
              <p className="text-gray-700">
                Tailored heatwave preparedness strategies co-designed with local government representatives from high-risk areas.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <UserGroupIcon className="w-12 h-12 text-orange-600 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-3">Community Education</h4>
              <p className="text-gray-700">
                Resources and assessments to help individuals and communities understand their heatwave readiness and take action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Approach */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-10">Our Research Approach</h3>
        <div className="space-y-6">
          <div className="border-l-4 border-orange-600 pl-6">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Evidence Gathering</h4>
            <p className="text-gray-700">
              We analyze heatwave risk factors, census data, and community vulnerability across all NSW LGAs to create a comprehensive risk picture.
            </p>
          </div>

          <div className="border-l-4 border-orange-600 pl-6">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Community Engagement</h4>
            <p className="text-gray-700">
              Local government representatives from high-risk areas participate in workshops to co-design resilience strategies tailored to their communities.
            </p>
          </div>

          <div className="border-l-4 border-orange-600 pl-6">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Digital Collaboration</h4>
            <p className="text-gray-700">
              The Heatwave Hub serves as an ongoing platform for collaboration, knowledge sharing, and education around heatwave preparedness.
            </p>
          </div>

          <div className="border-l-4 border-orange-600 pl-6">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Evaluation & Measurement</h4>
            <p className="text-gray-700">
              Researchers track preparedness improvements in pilot communities to measure the effectiveness of interventions and gather insights for broader implementation.
            </p>
          </div>
        </div>
      </section>

      {/* Research Team */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-10">Research Team</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 text-lg">{member.name}</h4>
                <p className="text-orange-600 font-semibold text-sm mt-1">{member.role}</p>
                <p className="text-gray-600 text-sm mt-2">{member.affiliation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / More Info */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-10">Common Questions</h3>
        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">Who is this hub for?</h4>
            <p className="text-gray-700">
              The Heatwave Hub is designed for everyone: individuals looking to improve their personal heat readiness, local government staff planning community resilience strategies, and researchers studying heatwave preparedness and impacts.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">How can I use the Heatwave Hub?</h4>
            <p className="text-gray-700 mb-3">
              You can:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
              <li>Take the <Link href="/test" className="text-orange-600 font-semibold hover:underline">Heatwave Readiness Assessment</Link> to evaluate your preparedness</li>
              <li>Explore the <Link href="/heatwave-map" className="text-orange-600 font-semibold hover:underline">interactive map</Link> to see heatwave risk in your region</li>
              <li>Access <Link href="/prepare" className="text-orange-600 font-semibold hover:underline">preparation resources and strategies</Link> to build resilience</li>
              <li>Find <Link href="/cooling-centres" className="text-orange-600 font-semibold hover:underline">cooling centres and support services</Link> in your area</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">Is my data private?</h4>
            <p className="text-gray-700">
              Yes. Your assessment responses are securely stored and used only for research and program evaluation purposes. Data is anonymized and reported only in aggregate form to protect individual privacy.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">How often is the data updated?</h4>
            <p className="text-gray-700">
              Heatwave risk data is updated as new research and climate projections become available. Community feedback and assessment data help us continuously improve the hub's resources and recommendations.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">How can my local government get involved?</h4>
            <p className="text-gray-700">
              Contact the research team to discuss how your LGA can participate in workshops, co-design preparedness strategies, and access aggregated regional data from the hub. Reach out via the contact page for partnership inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-16">
        <div className="max-w-6xl mx-auto text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Build Your Resilience?</h3>
          <p className="text-lg mb-8 opacity-90">
            Start your journey to better heatwave preparedness today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/test"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Take the Assessment
            </Link>
            <Link
              href="/heatwave-map"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors border-2 border-white"
            >
              Explore the Map
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Contact */}
      <section className="bg-gray-50 px-6 py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h4 className="font-bold text-gray-900 mb-4">Questions or Feedback?</h4>
          <p className="text-gray-700 mb-4">
            We'd love to hear from you. For inquiries about partnerships, data access, or general feedback, please contact:
          </p>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-gray-900 font-semibold">University of Newcastle – Heatwave Hub Project</p>
            <p className="text-gray-700 mt-2">
              Led by Associate Professor Danielle Verdon-Kidd
            </p>
            <p className="text-gray-600 text-sm mt-4">
              A project funded by the Australian Government's Disaster Ready Fund
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
