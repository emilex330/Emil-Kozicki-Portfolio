import { motion } from 'motion/react'
import {
  SiC,
  SiCplusplus,
  SiDjango,
  SiExpress,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNodedotjs,
  SiOpenjdk,
  SiPostgresql,
  SiPython,
  SiReact,
} from 'react-icons/si'
import { FaAws, FaCss3Alt, FaDatabase, FaSalesforce } from 'react-icons/fa6'

const AWS = '#FF9900'
const SFDC = '#00A1E0'

const GROUPS = [
  {
    label: 'Languages',
    items: [
      { name: 'Python', Icon: SiPython, color: '#3776AB' },
      { name: 'Java', Icon: SiOpenjdk, color: '#ED8B00' },
      { name: 'JavaScript', Icon: SiJavascript, color: '#E8C000' },
      { name: 'C++', Icon: SiCplusplus, color: '#00599C' },
      { name: 'C', Icon: SiC, color: '#7C8CA8' },
      { name: 'HTML', Icon: SiHtml5, color: '#E34F26' },
      { name: 'CSS', Icon: FaCss3Alt, color: '#1572B6' },
      { name: 'SQL', Icon: FaDatabase, color: '#4479A1' },
    ],
  },
  {
    label: 'Cloud & Backend',
    items: [
      { name: 'AWS', Icon: FaAws, color: AWS },
      { name: 'AWS Lambda', color: AWS },
      { name: 'Amazon EventBridge', color: AWS },
      { name: 'Amazon S3', color: AWS },
      { name: 'AWS Step Functions', color: AWS },
      { name: 'Amazon API Gateway', color: AWS },
      { name: 'AWS Batch', color: AWS },
      { name: 'Amazon DynamoDB', color: AWS },
      { name: 'AWS CDK', color: AWS },
      { name: 'PostgreSQL', Icon: SiPostgresql, color: '#4169E1' },
      { name: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
    ],
  },
  {
    label: 'Integration & Data',
    items: [
      { name: 'Salesforce', Icon: FaSalesforce, color: SFDC },
      { name: 'SOQL', color: SFDC },
      { name: 'Apex', color: SFDC },
      { name: 'Salesforce Bulk API 2.0', color: SFDC },
      { name: 'Lightning Web Components', color: SFDC },
      { name: 'REST API Integration' },
      { name: 'ETL / Data Pipelines' },
    ],
  },
  {
    label: 'Frameworks',
    items: [
      { name: 'React', Icon: SiReact, color: '#61DAFB' },
      { name: 'Node.js', Icon: SiNodedotjs, color: '#5FA04E' },
      { name: 'Express', Icon: SiExpress },
      { name: 'Django REST Framework', Icon: SiDjango, color: '#44B78B' },
    ],
  },
]

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
}

const tileVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.88 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
}

function SkillTile({ name, Icon, color }) {
  return (
    <motion.li
      className="skill"
      variants={tileVariants}
      style={color ? { '--brand': color } : undefined}
    >
      <span className="skill__mark" aria-hidden="true">
        {Icon ? <Icon /> : <span className="skill__dot" />}
      </span>
      <span className="skill__name">{name}</span>
    </motion.li>
  )
}

function SkillsGrid() {
  return (
    <div className="skills">
      {GROUPS.map((group) => (
        <div key={group.label}>
          <p className="skills__label">{group.label}</p>
          <motion.ul
            className="skills__grid"
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {group.items.map((item) => (
              <SkillTile key={item.name} {...item} />
            ))}
          </motion.ul>
        </div>
      ))}
    </div>
  )
}

export default SkillsGrid