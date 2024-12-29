import type { GameDesignBrief, VisualCreatorBrief, FilmmakingBrief, LogoDesignBrief, BookTuberBrief } from "../types/brief"

export const GAME_DESIGN_BRIEF: GameDesignBrief = {
  id: "game-design-brief-1",
  type: "game_design",
  title: "Game Design Creative Brief",
  description: "Create engaging content showcasing how Milanote can be used in game design workflows",
  createdAt: new Date(),
  updatedAt: new Date(),
  collaborationTimeline: [
    {
      step: 1,
      title: "Choose a video topic and Milanote use case",
      description: "Select a topic and plan how Milanote will be integrated",
    },
    {
      step: 2,
      title: "Draft boards and script for the segment",
      description: "Create your Milanote boards and prepare your content script",
    },
    {
      step: 3,
      title: "Shoot the draft video segment",
      description: "Record your content following the approved script and boards",
    },
    {
      step: 4,
      title: "Publish the video and receive payment",
      description: "After final approval, publish the content and complete the collaboration",
    },
  ],
  overview: {
    what: "Milanote is a tool for organizing creative projects. It exists to help people think and plan better at the early stages of the creative process. It's a flexible and unstructured workspace that lets ideas grow in whatever way makes sense to you.",
    gettingStarted: "If you're new to Milanote, start by signing up for a free account. We suggest spending some time familiarising yourself with Milanote. Trying the product will allow you to understand how the features work and how they can fit into your creative process.",
  },
  guidelines: [
    {
      category: "Board Creation Guidelines",
      items: [
        "Ensure you complete one project board and one sub-board",
        "Include various elements such as notes, images, website links, sketches",
        "Design your boards to be visually engaging",
        "Choose goal-oriented titles for your boards",
      ],
    },
    {
      category: "What to Avoid",
      items: [
        "Empty cards or task lists",
        "YouTube-related references",
        "Insufficient content",
        "Aimless content dumps",
        "Uninspiring visuals",
      ],
    },
  ],
  suggestions: {
    title: "Suggestions for your Milanote project",
    items: [
      "Make a plan for your project",
      "Brainstorm idea for the game",
      "Collect inspiration in a moodboard",
      "Make a character profile",
      "Explore the game character relationships",
      "Build a level design board",
    ],
  },
  examples: [
    {
      title: "Game Design Example 1",
      url: "https://www.youtube.com/watch?v=eDSL6fk758",
    },
    {
      title: "Game Design Example 2",
      url: "https://www.youtube.com/watch?v=_1pz_ohupPs",
    },
  ],
}

export const VISUAL_CREATOR_BRIEF: VisualCreatorBrief = {
  id: "visual-creator-brief-1",
  type: "visual_creator",
  title: "Visual Creator Creative Brief",
  description: "Create content showcasing how Milanote can enhance visual creative workflows",
  createdAt: new Date(),
  updatedAt: new Date(),
  collaborationTimeline: [
    {
      step: 1,
      title: "Choose a video topic and Milanote use case",
      description: "Select a visual design topic and plan how Milanote will be integrated",
    },
    {
      step: 2,
      title: "Draft boards and script for the segment",
      description: "Create your Milanote boards showcasing your visual design process",
    },
    {
      step: 3,
      title: "Shoot the draft video segment",
      description: "Record your content demonstrating visual design workflows in Milanote",
    },
    {
      step: 4,
      title: "Publish the video and receive payment",
      description: "After final approval, publish the content and complete the collaboration",
    },
  ],
  overview: {
    what: "Milanote is the perfect tool for visual creators. It provides a flexible canvas where you can organize your inspiration, plan your projects, and collaborate with clients. The visual nature of the tool makes it ideal for mood boards, style guides, and design presentations.",
    gettingStarted: "Start by creating a free Milanote account and exploring the visual design templates. The drag-and-drop interface makes it easy to arrange your content, and you can quickly add images, colors, and notes to your boards.",
  },
  guidelines: [
    {
      category: "Visual Content Guidelines",
      items: [
        "Create visually rich boards with a mix of images and design elements",
        "Show how Milanote helps organize visual inspiration",
        "Demonstrate the mood board creation process",
        "Include examples of client collaboration features",
      ],
    },
    {
      category: "Best Practices",
      items: [
        "Use high-quality images and screenshots",
        "Show real-world design workflow examples",
        "Highlight visual organization features",
        "Demonstrate how to create style guides",
      ],
    },
    {
      category: "What to Avoid",
      items: [
        "Low-resolution visuals",
        "Cluttered or disorganized boards",
        "Generic design examples",
        "Overly complex workflows",
      ],
    },
  ],
  examples: [
    {
      title: "Visual Design Workflow Example",
      url: "https://www.youtube.com/watch?v=example1",
    },
    {
      title: "Brand Design Process",
      url: "https://www.youtube.com/watch?v=example2",
    },
  ],
}

export const FILMMAKING_BRIEF: FilmmakingBrief = {
  id: "filmmaking-brief-1",
  type: "filmmaking",
  title: "Filmmaking Creative Brief",
  description: "Create engaging content showcasing how Milanote can streamline film production workflows",
  createdAt: new Date(),
  updatedAt: new Date(),
  collaborationTimeline: [
    {
      step: 1,
      title: "Choose a video topic and Milanote use case",
      description: "Select a topic and plan how Milanote will be integrated",
    },
    {
      step: 2,
      title: "Draft boards and script for the segment",
      description: "Create your Milanote boards and prepare your content script",
    },
    {
      step: 3,
      title: "Shoot the draft video segment",
      description: "Record your content following the approved script and boards",
    },
    {
      step: 4,
      title: "Publish the video and receive payment",
      description: "After final approval, publish the content and complete the collaboration",
    },
  ],
  overview: {
    what: "Milanote is a tool for organizing creative projects. It exists to help people think and plan better at the early stages of the creative process. It's a flexible and unstructured workspace that lets ideas grow in whatever way makes sense to you. It feels less like traditional software and more like working on a wall in a creative studio.",
    gettingStarted: "If you're new to Milanote, start by signing up for a free account. We suggest spending some time familiarising yourself with Milanote. Trying the product will allow you to understand how the features work and how they can fit into your creative process, as well as give you an opportunity to come up with ideas for a good project to share with your audience.",
  },
  guidelines: [
    {
      category: "Board Creation Guidelines",
      items: [
        "Multiple Boards: Ensure you complete at least two boards (e.g., Project Plan and Moodboard)",
        "Variety of Elements: Include notes, images, website links, sketches, task cards, and color swatches",
        "Visual Appeal: Design boards to be visually engaging with balanced mix of elements",
        "Board Titles: Choose goal-oriented titles that clearly indicate purpose",
      ],
    },
    {
      category: "What to Avoid",
      items: [
        "Empty Cards: No blank note cards or task lists",
        "YouTube References: Avoid YouTube-related names or planning thumbnails",
        "Insufficient Content: Ensure boards are not sparse or lacking depth",
        "Aimless Content Dumps: Avoid boards without clear focus or goals",
        "Uninspiring Visuals: Avoid overly text-heavy or poorly arranged content",
      ],
    },
    {
      category: "Script Guidelines",
      items: [
        "Introduce Milanote properly before diving into projects",
        "Use 'sign up for free' instead of 'download'",
        "Include clear call-to-action directing to description link",
        "Show Milanote interface clearly with proper screen recording",
        "Allow viewers time to understand the workflow",
      ],
    },
  ],
  examples: [
    {
      title: "Film Pre-production Example",
      url: "https://www.youtube.com/watch?v=AXidstI2kAg",
    },
    {
      title: "Filmmaking Workflow",
      url: "https://www.youtube.com/watch?v=El76uuVrkzI",
    },
    {
      title: "Production Planning",
      url: "https://www.youtube.com/watch?v=gdbsrTO3klk",
    },
    {
      title: "Creative Process",
      url: "https://www.youtube.com/watch?v=e5x0C5_SWC0",
    },
    {
      title: "Project Organization",
      url: "https://www.youtube.com/watch?v=z5TLdvASx2g",
    },
  ],
  productionTools: {
    title: "Essential Production Tools",
    items: [
      "Pre-production plan board",
      "Shoot moodboard",
      "Storyboard template",
      "Call sheet organizer",
      "Shot list planner",
      "Gear list manager",
    ],
  },
}

export const LOGO_DESIGN_BRIEF: LogoDesignBrief = {
  id: "logo-design-brief-1",
  type: "logo_design",
  title: "Logo Design Creative Brief",
  description: "Create engaging content showcasing how Milanote can enhance the logo design process",
  createdAt: new Date(),
  updatedAt: new Date(),
  collaborationTimeline: [
    {
      step: 1,
      title: "Choose a video topic and Milanote use case",
      description: "Select a topic and plan how Milanote will be integrated",
    },
    {
      step: 2,
      title: "Draft boards and script for the segment",
      description: "Create your Milanote boards and prepare your content script",
    },
    {
      step: 3,
      title: "Shoot the draft video segment",
      description: "Record your content following the approved script and boards",
    },
    {
      step: 4,
      title: "Publish the video and receive payment",
      description: "After final approval, publish the content and complete the collaboration",
    },
  ],
  overview: {
    what: "Milanote is a tool for organizing creative projects. It exists to help people think and plan better at the early stages of the creative process. It's a flexible and unstructured workspace that lets ideas grow in whatever way makes sense to you. It feels less like traditional software and more like working on a wall in a creative studio.",
    gettingStarted: "If you're new to Milanote, start by signing up for a free account. We suggest spending some time familiarising yourself with Milanote. Trying the product will allow you to understand how the features work and how they can fit into your creative process, as well as give you an opportunity to come up with ideas for a good project to share with your audience.",
  },
  guidelines: [
    {
      category: "Board Creation Guidelines",
      items: [
        "Multiple Boards: Ensure you complete at least two boards (e.g., Project Plan and Moodboard)",
        "Variety of Elements: Include various elements such as notes, images, website links, sketches, task cards, and color swatches",
        "Visual Appeal: Design boards to be visually engaging with balanced mix of elements",
        "Board Titles: Choose goal-oriented titles that clearly indicate purpose",
      ],
    },
    {
      category: "What to Avoid",
      items: [
        "Empty Cards: No blank note cards or task lists",
        "YouTube References: Avoid YouTube-related names or planning thumbnails",
        "Insufficient Content: Ensure boards are not sparse or lacking depth",
        "Aimless Content Dumps: Avoid boards without clear focus or goals",
        "Uninspiring Visuals: Avoid overly text-heavy or poorly arranged content",
      ],
    },
    {
      category: "Script Guidelines",
      items: [
        "Avoid mentioning YouTube planning or content strategies",
        "Introduce Milanote properly before diving into projects",
        "Use 'sign up for free' instead of 'download'",
        "Include clear call-to-action directing to description link",
      ],
    },
  ],
  examples: [
    {
      title: "Logo Design Process",
      url: "https://www.youtube.com/watch?v=FFhQ4CMwwTs",
    },
    {
      title: "Brand Identity Development",
      url: "https://www.youtube.com/watch?v=_NMD4hoad3A",
    },
  ],
  designProcess: {
    title: "Logo Design Process Steps",
    items: [
      "Create a logo design brief board",
      "Develop a visual moodboard",
      "Organize design concepts and iterations",
      "Set up a logo design project plan",
      "Create a logo brainstorming space",
      "Build a brand positioning map",
    ],
  },
}

export const BOOKTUBER_BRIEF: BookTuberBrief = {
  id: "booktuber-brief-1",
  type: "booktuber",
  title: "BookTuber Creative Brief",
  description: "Create engaging content showcasing how Milanote can enhance creative writing and storytelling",
  createdAt: new Date(),
  updatedAt: new Date(),
  collaborationTimeline: [
    {
      step: 1,
      title: "Choose a video topic and Milanote use case",
      description: "Select a topic and plan how Milanote will be integrated",
    },
    {
      step: 2,
      title: "Draft boards and script for the segment",
      description: "Create your Milanote boards and prepare your content script",
    },
    {
      step: 3,
      title: "Shoot the draft video segment",
      description: "Record your content following the approved script and boards",
    },
    {
      step: 4,
      title: "Publish the video and receive payment",
      description: "After final approval, publish the content and complete the collaboration",
    },
  ],
  overview: {
    what: "Milanote is a tool for organizing creative projects. It exists to help people think and plan better at the early stages of the creative process. It's a flexible and unstructured workspace that lets ideas grow in whatever way makes sense to you. It feels less like traditional software and more like working on a wall in a creative studio.",
    gettingStarted: "If you're new to Milanote, start by signing up for a free account. We suggest spending some time familiarising yourself with Milanote. Trying the product will allow you to understand how the features work and how they can fit into your creative process, as well as give you an opportunity to come up with ideas for a good project to share with your audience.",
  },
  guidelines: [
    {
      category: "Board Creation Guidelines",
      items: [
        "Multiple Boards: Ensure you complete at least two boards (e.g., Project Plan and Moodboard)",
        "Variety of Elements: Include various elements such as notes, images, website links, sketches, task cards, and color swatches",
        "Visual Appeal: Design boards to be visually engaging with balanced mix of elements",
        "Board Titles: Choose goal-oriented titles that clearly indicate purpose",
      ],
    },
    {
      category: "What to Avoid",
      items: [
        "Empty Cards: No blank note cards or task lists",
        "YouTube References: Avoid YouTube-related names or planning thumbnails",
        "Insufficient Content: Ensure boards are not sparse or lacking depth",
        "Aimless Content Dumps: Avoid boards without clear focus or goals",
        "Uninspiring Visuals: Avoid overly text-heavy or poorly arranged content",
      ],
    },
    {
      category: "Script Guidelines",
      items: [
        "Avoid mentioning YouTube planning or content strategies",
        "Introduce Milanote properly before diving into projects",
        "Use 'sign up for free' instead of 'download'",
        "Include clear call-to-action directing to description link",
      ],
    },
  ],
  examples: [
    {
      title: "Creative Writing Process",
      url: "https://youtu.be/1wqQEQeC6Nw",
    },
    {
      title: "Story Planning",
      url: "https://youtu.be/uCJRiQTin2o",
    },
    {
      title: "Writing Workflow",
      url: "https://youtu.be/OahJKpiA3GI",
    },
    {
      title: "Project Organization",
      url: "https://youtu.be/-PBNCBtLXPs",
    },
    {
      title: "Content Planning",
      url: "https://youtu.be/hLsLPqHeQKI",
    },
  ],
  writingTools: {
    title: "Writing Tools",
    items: [
      "Story plan board",
      "Character profile template",
      "Brainstorming space",
      "Character relationship map",
      "Research collection board",
      "Story outline organizer",
    ],
  },
} 