import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
	NAME: "Tushar Sarang",
	EMAIL: "hello@tushar.im",
	NUM_POSTS_ON_HOMEPAGE: 3,
	NUM_WORKS_ON_HOMEPAGE: 2,
	NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
	TITLE: "Home",
	DESCRIPTION: "Tushar's Blog and portfolio",
};

export const BLOG: Metadata = {
	TITLE: "Blog",
	DESCRIPTION: "Blogs about software enineering, team management, and more.",
};

export const WORK: Metadata = {
	TITLE: "Work",
	DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
	TITLE: "Projects",
	DESCRIPTION:
		"A collection of my projects, with links to repositories and demos.",
};

export const SOCIALS: Socials = [
	{
		NAME: "twitter-x",
		HREF: "https://x.com/tushar-im",
	},
	{
		NAME: "github",
		HREF: "https://github.com/tushar-im",
	},
	{
		NAME: "linkedin",
		HREF: "https://www.linkedin.com/in/t24",
	},
];

export const INTRO_TEXTS: string[] = [
	"I am a Software Engineering Manager with over 7 years of experience in building scalable web applications, managing cloud infrastructure, and leading high-performing engineering teams. As a Software Engineering Manager, I have successfully led cross-functional teams of 10+ engineers, driving excellence in backend, frontend, and DevOps disciplines. I specialize in implementing Agile/Scrum methodologies, optimizing system performance, and fostering collaboration through initiatives like cross-team pairing and focused delivery squads.",
	"On the technical side, I bring extensive expertise in backend development using Python, Django, and AWS, along with hands-on experience in frontend technologies like TypeScript and Angular. I have a strong focus on CI/CD pipelines, DevOps practices, and cloud infrastructure management, ensuring seamless project delivery and system scalability. Whether it’s designing REST APIs, mentoring developers, or building user-friendly interfaces, I thrive on solving complex problems and delivering high-quality solutions.",
	"Explore my work and projects to see how I combine technical expertise and leadership to create impactful results. Let’s connect and build something amazing together!",
];
