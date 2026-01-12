import PageLayout from "../components/PageLayout";
import { Users, Mail, Linkedin, Twitter } from "lucide-react";

export default function EditorialBoardPage() {
  const boardMembers = [
    {
      name: "Maria Santos",
      position: "Editor-in-Chief",
      photo: null,
      bio: "Leading the publication with vision and dedication to journalistic excellence.",
      email: "maria.santos@clarionette.com",
      social: { twitter: "#", linkedin: "#" }
    },
    {
      name: "John Dela Cruz",
      position: "Managing Editor",
      photo: null,
      bio: "Overseeing daily operations and ensuring quality content delivery.",
      email: "john.delacruz@clarionette.com",
      social: { twitter: "#", linkedin: "#" }
    },
    {
      name: "Ana Reyes",
      position: "News Editor",
      photo: null,
      bio: "Coordinating news coverage and maintaining journalistic standards.",
      email: "ana.reyes@clarionette.com",
      social: { twitter: "#", linkedin: "#" }
    },
    {
      name: "Carlos Mendoza",
      position: "Sports Editor",
      photo: null,
      bio: "Bringing exciting sports coverage and athlete stories to our readers.",
      email: "carlos.mendoza@clarionette.com",
      social: { twitter: "#", linkedin: "#" }
    },
    {
      name: "Isabella Garcia",
      position: "Features Editor",
      photo: null,
      bio: "Crafting compelling feature stories that inspire and inform.",
      email: "isabella.garcia@clarionette.com",
      social: { twitter: "#", linkedin: "#" }
    },
    {
      name: "Miguel Torres",
      position: "Literary Editor",
      photo: null,
      bio: "Showcasing creative writing and fostering literary talent.",
      email: "miguel.torres@clarionette.com",
      social: { twitter: "#", linkedin: "#" }
    }
  ];

  return (
    <PageLayout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Editorial Board
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated team behind The Clarionette, committed to delivering quality journalism and fostering student voices at Malate Catholic School.
          </p>
        </div>

        {/* Board Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {boardMembers.map((member, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Photo Placeholder */}
              <div className="h-64 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <Users className="w-24 h-24 text-white opacity-50" />
              </div>

              {/* Member Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-red-600 font-semibold mb-3">
                  {member.position}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  {member.bio}
                </p>

                {/* Contact & Social */}
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                  <a 
                    href={`mailto:${member.email}`}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title={`Email ${member.name}`}
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a 
                    href={member.social.twitter}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a 
                    href={member.social.linkedin}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Join Us Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Interested in becoming part of The Clarionette? We're always looking for passionate student writers, photographers, and editors.
          </p>
          <a 
            href="mailto:editorial@clarionette.com"
            className="inline-flex items-center px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <Mail className="w-5 h-5 mr-2" />
            Contact Us
          </a>
        </div>
      </main>
    </PageLayout>
  );
}
