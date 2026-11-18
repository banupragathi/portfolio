// src/data/achievements.js

const base = import.meta.env.BASE_URL;

export const achievements = [
  {
    id: 1,
    label: 'WINNER',
    title: "Smart India Hackathon'25",
    desc: 'Won the internal hackathon by developing a SaaS platform solution for the Government of Punjab to address real-world administrative challenges.',
    image: `${base}assets/card1.jpg`,
    expandImages: [`${base}assets/card1-expand1.jpg`, `${base}assets/card1-expand2.jpg`],
  },
  {
    id: 2,
    label: 'TOP 5 FINALIST',
    title: 'TI-Forge Hackathon',
    desc: 'Developed a Disaster Mesh Hybrid system and secured a position among the top 5 teams for innovative emergency communication.',
    image: `${base}assets/card2.jpg`,
    expandImages: [`${base}assets/card2-expand1.jpg`, `${base}assets/card2-expand2.jpg`],
  },
  {
    id: 3,
    label: 'RUNNER-UP',
    title: 'NXT Gen Hackathon',
    desc: 'Developed a hospital crowd management system to optimize patient flow, reduce waiting time, and improve healthcare efficiency.',
    image: `${base}assets/card3.jpeg`,
    expandImages: [`${base}assets/card3-expand1.jpg`, `${base}assets/card3-expand2.jpg`],
  },
  {
    id: 5,
    label: 'ORGANISER',
    title: "HackVerse'25",
    desc: 'Organised an international-level AI and Web3 hackathon with 200+ participants, fostering innovation, collaboration, and real-world problem solving.',
    image: `${base}assets/card5.png`,
    expandImages: [`${base}assets/card5-expand1.jpg`, `${base}assets/card5-expand2.jpg`],
  },
  {
    id: 6,
    label: 'ORGANISER',
    title: 'Fast and Curious – AI Technical Event',
    desc: 'An interactive AI-themed competition featuring rapid-fire quizzes, problem-solving rounds, and fun technical challenges for participants.',
    image: `${base}assets/card6.jpeg`,
    expandImages: [`${base}assets/card6-expand1.jpg`, `${base}assets/card6-expand2.jpg`],
  },
  {
    id: 7,
    label: 'ORGANISER-EMCEE',
    title: "Builder's Qonect – India's Largest AI & Web3 Panel",
    desc: 'Hosted and coordinated a large-scale AI and Web3 panel discussion bringing together innovators, developers, and industry experts from across India.',
    image: `${base}assets/card7.jpeg`,
    expandImages: [`${base}assets/card7-expand1.jpg`, `${base}assets/card7-expand2.jpg`],
  },
  {
    id: 8,
    label: 'CODEKRAFTER HEAD',
    title: 'LaunchPad',
    desc: 'Presented insights about the technical club, its vision, activities, and opportunities to guide and inspire new members.',
    image: `${base}assets/card8.jpeg`,
    expandImages: [`${base}assets/card8-expand1.jpg`, `${base}assets/card8-expand2.jpg`],
  },
  {
    id: 9,
    label: 'JUNIOR TRAINER',
    title: "Ignite'26",
    desc: 'Conducted an interactive session on AI for Allen students, introducing emerging technologies and real-world AI applications.',
    image: `${base}assets/card9.jpeg`,
    expandImages: [`${base}assets/card9-expand1.jpg`, `${base}assets/card9-expand2.jpg`],
  },
  {
    id: 10,
    label: 'HACKATHON',
    title: 'HackNocturne',
    desc: 'Participated in a Bengaluru-based hackathon, competing against 80+ teams in innovative problem-solving challenges.',
    image: `${base}assets/card10.jpeg`,
    expandImages: [`${base}assets/card10-expand1.jpg`, `${base}assets/card10-expand2.jpg`],
  },
];
