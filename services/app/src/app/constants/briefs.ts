import type { GameDesignBrief, VisualCreatorBrief } from "../types/brief"

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