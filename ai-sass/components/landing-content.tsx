"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const testimonials = [
  {
    name: "Haruna",
    avatar: "A",
    title: "Software Engineer",
    description: "This is the best AI tool I have ever used. It has saved me so much time and effort.",
  },
  {
    name: "Shehu",
    avatar: "A",
    title: "Product Designer",
    description: "This is the best AI tool I have ever used. It has saved me so much time and effort.",
  },
  {
    name: "Mubarak",
    avatar: "A",
    title: "Economist",
    description: "This is the best AI tool I have ever used. It has saved me so much time and effort.",
  },
  {
    name: "Sadik",
    avatar: "A",
    title: "UI/UX Designer",
    description: "This is the best AI tool I have ever used. It has saved me so much time and effort.",
  },
];

const LandingContent = () => {
  return (
    <div className="px-2 pb-10">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        Testimonials
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card key={item.description} className="bg-[#192339] border-none text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent>
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LandingContent;
