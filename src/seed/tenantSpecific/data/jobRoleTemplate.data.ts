import {PlainObject} from '../../../modules/common/common.dto';
import {adeccoSwi} from './tenant.data';
import {langEnglish} from '../../essential/data/language.data';
import {intGuid} from '../../utils/seed.utils';

// NOTE: please don't change existing IDs
export const jobRoleTemplateData: PlainObject[] = [
  //'Adecco Switzerland'
  //Cleaner
  {
    id: '71cbb745-c41a-49b2-aa9c-a0ae1cdd4525',
    tenantId: adeccoSwi.id,
    jobRoleId: intGuid(6),
    languageId: langEnglish.id,
    template: `Cleaner

Job description

We are looking for a detail oriented cleaner.

Your tasks
- Cleaning of offices/bathrooms and other rooms
- Waste disposal
- Independent performance of all cleaning duties (offices/public areas/WCs, etc.)
- Visual inspection for cleanliness and order
- Knowledge and use of safety and hygiene regulations

Your profile
- No training necessary, newcomers welcome
- Experience in cleaning is desirable, but not essential
- Strong sense of cleanliness and order
- Fast and efficient manner of working
- Careful working manner
- Thoroughness and reliability
- Flexible and able to work in a team
- Physical resilience
- Knowledge of German

Your perspectives/benefits
- A friendly and collaborative working atmosphere
- Temporary position with potential for permanent employment
`,
  },
  //Automobile mechatronics engineer
  {
    id: '3b78300e-5d45-481c-88c2-843cce573bed',
    tenantId: adeccoSwi.id,
    jobRoleId: intGuid(7),
    languageId: langEnglish.id,
    template: `Automobile mechatronics engineer

Job description

We are looking for an automobile mechatronics engineer for interesting and varied work with perspective.

Your tasks
- Service and repair of cars/trucks
- Preparation for MFK inspections
- Maintenance and repair activities
- Inspections
- Changing tyres
- Customer contact
- Performance of diagnoses using tests and diagnostic equipment
- Training of apprentices
- Creation of cost accounts using defect lists

Your profile
- Training as an automobile mechatronics engineer
- Previous professional experience
- Valid driving license
- Exact, customer-oriented working manner
- Team player and willingness to work
- Willingness to undergo training
- Good written and spoken German

Your perspectives/benefits
- Varied tasks in a modern company
- An exciting work environment in which you can use your skills and commitment every day
- Long-term position with flexible working hours; early and late shifts
- Numerous opportunities for training
`,
  },
  //Loader and unloader
  {
    id: '4b872ea0-bc7b-4323-9431-06ab5c96bf80',
    tenantId: adeccoSwi.id,
    jobRoleId: intGuid(8),
    languageId: langEnglish.id,
    template: `Loader and unloader

Job description

We are looking for a proactive loader and unloader to support our team.

Your tasks
- Loading and unloading different weights of materials or products
- Observe load safety

Your profile
- Readiness for physically challenging work
- Physical resilience
- Team player
- Reliability
- Knowledge of German

Your perspectives/benefits
- Special rates for vacations and public holidays
- Induction by a motivated team
- Opportunities for long-term employment in the future
`,
  },
  //Forklift driver
  {
    id: 'a3363d46-3c50-47cf-b8e5-ba430beed375',
    tenantId: adeccoSwi.id,
    jobRoleId: intGuid(9),
    languageId: langEnglish.id,
    template: `Forklift driver

Job description

We are looking for a motivated personality as a forklift driver for our company.

Your tasks
- Warehousing of goods
- Transport of goods within the warehouse
- Help with any storage activities
- Stock management and assistance with stocktakes

Your profile
- Forklift license
- Some experience as a forklift driver
- Experience working with high shelving and storage work
- Practical experience handling heavy goods
- Multiple years of experience in logistics
- Readiness for shift work
- Careful working manner
- Flexible and able to work in a team
- Reliability and willingness to work
- Physical resilience

Your perspectives/benefits
- A friendly and collegial working atmosphere
- Option for later permanent employment
`,
  },
  //Back office staff member
  {
    id: '68da912f-7fbe-4bf2-afd5-0d93b8eb589a',
    tenantId: adeccoSwi.id,
    jobRoleId: intGuid(10),
    languageId: langEnglish.id,
    template: `Back office staff member

Job description

We are looking for a committed, customer-oriented and reliable back office employee to reinforce our team.

Your tasks
- Processing of offers and orders
- Follow-up of offers
- Follow-up of delivery deadlines
- Processing of complaints
- Phone contact for customers
- Management support
- Scheduling of appointments
- Daily office (correspondence/telephone/office material/looking after guests)
- General administrative tasks
- Recording of staff absences, etc.

Your profile
- Completed commercial apprenticeship
- Negotiating skills and confident manner
- Experience in sales and customer support
- Very good communications style in French/English and German (further languages an advantage)
- Neat, confident and open manner
- Team player, empathetic and the will to learn
- Commitment, organisational talent and resilient
- Reliability, flexibility and team spirit
- Confident with MS Office products (SAP an advantage)
- Independent and goal-oriented working manner

Your perspectives/benefits
- Varied and challenging tasks
- Large degree of independence and responsibility
- Temporary position with potential for permanent employment
`,
  },
  //Electrical engineer
  {
    id: 'f54bfaa5-c8da-4573-a697-53a8aaa2d87b',
    tenantId: adeccoSwi.id,
    jobRoleId: intGuid(36),
    languageId: langEnglish.id,
    template: `Electrical engineer

Job description

We are looking for an electrical engineering graduate with experience in the areas of automation and industrial technology.

Your tasks
- Development and implementation of electrical systems (e.g. electrical switches)
- Simulation of analogue and digital electrical systems
- Planning and support of development and model tests
- Ensuring compliance with the relevant standards and guidelines (e.g. machine safety)
- Project leadership
- Competitor and patent analyses
- Providing expert advice to employees and customers
- Performance of technical calculations

Your profile
- Completed studies in electrical engineering (ETH/FH) with professional experience
- Experience with various programming languages
- Enthusiasm, motivation, self-confidence and ambition
- Interest in novel technologies in the field of electrical engineering
- Independent working method
- Strong service and customer orientation
- Structured approach to work with high standards
- Very good written and spoken German

Your perspectives/benefits
- Opportunities for promotion
- Interesting, responsible and challenging work
- Modern infrastructure
- Advanced employment conditions
`,
  },
  // Added for DEMO purposes. Remove, if it's no longer needed. (2330)
  {
    id: 'f54bfaa5-c8da-4573-a697-53a8aaa2d87c',
    tenantId: adeccoSwi.id,
    jobRoleId: intGuid(49),
    languageId: langEnglish.id,
    template: `Assistant Manager (m/w/d)

Become part of XXXX as an Assistant Manager (m/f/d) in the retail sector and start your career with us today!

How will you succeed with us?
We believe in working together and your contribution will be crucial to the success of our business.
- You will greet customers, guide them through the sales process and be a true ambassador of our core values
- Opening and closing the store and ensuring a clean and tidy working environment.
- Decorating the shop in the morning and putting away the display cases, as well as clearing away in the evening
- Key holder responsibilities, ensuring alarm systems are working and escalating issues
- Inspire and motivate your sales team to achieve positive results and reach their full potential
- Train, coach and develop all sales staff.
- Managing the store in the absence of the Store Manager (m/f/d)
- Writing daily reports on KPI results, issues and areas for development for the next day
- Weekly report of sales and buying activities to the Store Manager (m/f/d).

How will you make a difference?
You have strong sales skills and work with your colleagues (m/f/d) to achieve set targets.
As Assistant Manager (m/f/d) you have excellent leadership skills and motivate and inspire your team to achieve successful results. As the link between the Store Manager (m/f/d) and the sales team, you will drive performance, mentor and coach your team and promote the potential of each team member.
- You are already an established and experienced assistant store manager in retail ideally
- Strong organizational, leadership and networking skills
- Excellent interpersonal and communication skills, reliable and outgoing
- Excellent sales skills & negotiation skills
- Strong people manager, able to lead and inspire your team

How can we make you smile?
Two days will never be the same, you will experience a lot of variety in your role, with sales, people management and back-office reporting being very important aspects.`,
  },
];
