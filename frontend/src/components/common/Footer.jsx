import React from 'react'
import { FaEnvelope, FaPhone } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const developers = [
    {
      name: 'Ishaan Das',
      email: 'ishaan.das22b@iiitg.ac.in',
      phone: '8084411910',
    },
    {
      name: 'Harsh Choudhary',
      email: 'harsh.choudhary22b@iiitg.ac.in',
      phone: '6395993566',
    },
    {
      name: 'Harsh Prajapati',
      email: 'harsh.prajapati22b@iiitg.ac.in',
      phone: '7983322017',
    },
    {
      name: 'Manya Maheshwari',
      email: 'manya.maheshwari22b@iiitg.ac.in',
      phone: '9528569142',
    },
  ]

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Contact Us Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider text-center">
            Contact Us
          </h3>
        </div>

        {/* Developer Information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {developers.map((developer, index) => (
            <div key={index} className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{developer.name}</h4>
              <p className="mt-2 text-gray-500 dark:text-gray-400 flex items-center justify-center">
                <FaEnvelope className="mr-2" />
                <a href={`mailto:${developer.email}`} className="hover:underline">
                  {developer.email}
                </a>
              </p>
              <p className="mt-2 text-gray-500 dark:text-gray-400 flex items-center justify-center">
                <FaPhone className="mr-2" />
                <a href={`tel:${developer.phone}`} className="hover:underline">
                  {developer.phone}
                </a>
              </p>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-base text-gray-500 dark:text-gray-400 text-center">
            &copy; {currentYear} AirAware. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer