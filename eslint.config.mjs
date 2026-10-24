import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    files: ["components/GoalEditor.tsx", "components/GoalListManager.tsx"],
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
];

export default config;
