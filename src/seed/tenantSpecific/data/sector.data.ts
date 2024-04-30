import {PlainObject} from '../../../modules/common/common.dto';
import {intGuid} from '../../utils/seed.utils';
import {
  adeccoPol,
  adeccoLux,
  adiaLux,
  adeccoSwi,
  genericSwi,
  adeccoGroupSwi,
  badenochAndClarkSwi,
  pontoonSwi,
  springProSwi,
  adeccoUsa,
  lhhSwi,
} from './tenant.data';

// NOTE: please add new records at the end of the file and don't change existing IDs
export const sectorData: PlainObject[] = [
  // POL
  {
    name: 'Advisory',
    tenantId: adeccoPol.id,
    id: intGuid(1),
  },
  {
    name: 'Audit',
    tenantId: adeccoPol.id,
    id: intGuid(2),
  },
  {
    name: 'Banking / Financial Services',
    tenantId: adeccoPol.id,
    id: intGuid(3),
  },
  {
    name: 'Construction',
    tenantId: adeccoPol.id,
    id: intGuid(4),
  },
  {
    name: 'Engineering & Manu',
    tenantId: adeccoPol.id,
    id: intGuid(5),
  },
  {
    name: 'Finance & Accounting',
    tenantId: adeccoPol.id,
    id: intGuid(6),
  },
  {
    name: 'FMCG',
    tenantId: adeccoPol.id,
    id: intGuid(7),
  },
  {
    name: 'Hospitality Chefs',
    tenantId: adeccoPol.id,
    id: intGuid(8),
  },
  {
    name: 'Human Resources',
    tenantId: adeccoPol.id,
    id: intGuid(9),
  },
  {
    name: 'Industrial Manufacturing',
    tenantId: adeccoPol.id,
    id: intGuid(10),
  },
  {
    name: 'Insurance',
    tenantId: adeccoPol.id,
    id: intGuid(11),
  },
  {
    name: 'Insurance non-life',
    tenantId: adeccoPol.id,
    id: intGuid(12),
  },
  {
    name: 'Legal & Compliance',
    tenantId: adeccoPol.id,
    id: intGuid(13),
  },
  {
    name: 'Legal in-House',
    tenantId: adeccoPol.id,
    id: intGuid(14),
  },
  {
    name: 'Legal Law firms',
    tenantId: adeccoPol.id,
    id: intGuid(15),
  },
  {
    name: 'Logistics',
    tenantId: adeccoPol.id,
    id: intGuid(16),
  },
  {
    name: 'Marketing',
    tenantId: adeccoPol.id,
    id: intGuid(17),
  },
  {
    name: 'Medical',
    tenantId: adeccoPol.id,
    id: intGuid(18),
  },
  {
    name: 'NPO/Public Sector',
    tenantId: adeccoPol.id,
    id: intGuid(19),
  },
  {
    name: 'Office support',
    tenantId: adeccoPol.id,
    id: intGuid(20),
  },
  {
    name: 'Procurement',
    tenantId: adeccoPol.id,
    id: intGuid(21),
  },
  {
    name: 'Property',
    tenantId: adeccoPol.id,
    id: intGuid(22),
  },
  {
    name: 'Quality',
    tenantId: adeccoPol.id,
    id: intGuid(23),
  },
  {
    name: 'Sales/BD',
    tenantId: adeccoPol.id,
    id: intGuid(24),
  },
  {
    name: 'Services/Consulting',
    tenantId: adeccoPol.id,
    id: intGuid(25),
  },
  {
    name: 'Supply Chain',
    tenantId: adeccoPol.id,
    id: intGuid(26),
  },
  {
    name: 'Technology',
    tenantId: adeccoPol.id,
    id: intGuid(27),
  },

  // LUX
  {
    name: 'Advisory',
    tenantId: adeccoLux.id,
    id: intGuid(28),
  },
  {
    name: 'Audit',
    tenantId: adeccoLux.id,
    id: intGuid(29),
  },
  {
    name: 'Banking / Financial Services',
    tenantId: adeccoLux.id,
    id: intGuid(30),
  },
  {
    name: 'Construction',
    tenantId: adeccoLux.id,
    id: intGuid(31),
  },
  {
    name: 'Engineering & Manu',
    tenantId: adeccoLux.id,
    id: intGuid(32),
  },
  {
    name: 'Finance & Accounting',
    tenantId: adeccoLux.id,
    id: intGuid(33),
  },
  {
    name: 'FMCG',
    tenantId: adeccoLux.id,
    id: intGuid(34),
  },
  {
    name: 'Hospitality Chefs',
    tenantId: adeccoLux.id,
    id: intGuid(35),
  },
  {
    name: 'Human Resources',
    tenantId: adeccoLux.id,
    id: intGuid(36),
  },
  {
    name: 'Industrial Manufacturing',
    tenantId: adeccoLux.id,
    id: intGuid(37),
  },
  {
    name: 'Insurance',
    tenantId: adeccoLux.id,
    id: intGuid(38),
  },
  {
    name: 'Insurance non-life',
    tenantId: adeccoLux.id,
    id: intGuid(39),
  },
  {
    name: 'Legal & Compliance',
    tenantId: adeccoLux.id,
    id: intGuid(40),
  },
  {
    name: 'Legal in-House',
    tenantId: adeccoLux.id,
    id: intGuid(41),
  },
  {
    name: 'Legal Law firms',
    tenantId: adeccoLux.id,
    id: intGuid(42),
  },
  {
    name: 'Logistics',
    tenantId: adeccoLux.id,
    id: intGuid(43),
  },
  {
    name: 'Marketing',
    tenantId: adeccoLux.id,
    id: intGuid(44),
  },
  {
    name: 'Medical',
    tenantId: adeccoLux.id,
    id: intGuid(45),
  },
  {
    name: 'NPO/Public Sector',
    tenantId: adeccoLux.id,
    id: intGuid(46),
  },
  {
    name: 'Office support',
    tenantId: adeccoLux.id,
    id: intGuid(47),
  },
  {
    name: 'Procurement',
    tenantId: adeccoLux.id,
    id: intGuid(48),
  },
  {
    name: 'Property',
    tenantId: adeccoLux.id,
    id: intGuid(49),
  },
  {
    name: 'Quality',
    tenantId: adeccoLux.id,
    id: intGuid(50),
  },
  {
    name: 'Sales/BD',
    tenantId: adeccoLux.id,
    id: intGuid(51),
  },
  {
    name: 'Services/Consulting',
    tenantId: adeccoLux.id,
    id: intGuid(52),
  },
  {
    name: 'Supply Chain',
    tenantId: adeccoLux.id,
    id: intGuid(53),
  },
  {
    name: 'Technology',
    tenantId: adeccoLux.id,
    id: intGuid(54),
  },

  // ADIALUX
  {
    name: 'Advisory',
    tenantId: adiaLux.id,
    id: intGuid(55),
  },
  {
    name: 'Audit',
    tenantId: adiaLux.id,
    id: intGuid(56),
  },
  {
    name: 'Banking / Financial Services',
    tenantId: adiaLux.id,
    id: intGuid(57),
  },
  {
    name: 'Construction',
    tenantId: adiaLux.id,
    id: intGuid(58),
  },
  {
    name: 'Engineering & Manu',
    tenantId: adiaLux.id,
    id: intGuid(59),
  },
  {
    name: 'Finance & Accounting',
    tenantId: adiaLux.id,
    id: intGuid(60),
  },
  {
    name: 'FMCG',
    tenantId: adiaLux.id,
    id: intGuid(61),
  },
  {
    name: 'Hospitality Chefs',
    tenantId: adiaLux.id,
    id: intGuid(62),
  },
  {
    name: 'Human Resources',
    tenantId: adiaLux.id,
    id: intGuid(63),
  },
  {
    name: 'Industrial Manufacturing',
    tenantId: adiaLux.id,
    id: intGuid(64),
  },
  {
    name: 'Insurance',
    tenantId: adiaLux.id,
    id: intGuid(65),
  },
  {
    name: 'Insurance non-life',
    tenantId: adiaLux.id,
    id: intGuid(66),
  },
  {
    name: 'Legal & Compliance',
    tenantId: adiaLux.id,
    id: intGuid(67),
  },
  {
    name: 'Legal in-House',
    tenantId: adiaLux.id,
    id: intGuid(68),
  },
  {
    name: 'Legal Law firms',
    tenantId: adiaLux.id,
    id: intGuid(69),
  },
  {
    name: 'Logistics',
    tenantId: adiaLux.id,
    id: intGuid(70),
  },
  {
    name: 'Marketing',
    tenantId: adiaLux.id,
    id: intGuid(71),
  },
  {
    name: 'Medical',
    tenantId: adiaLux.id,
    id: intGuid(72),
  },
  {
    name: 'NPO/Public Sector',
    tenantId: adiaLux.id,
    id: intGuid(73),
  },
  {
    name: 'Office support',
    tenantId: adiaLux.id,
    id: intGuid(74),
  },
  {
    name: 'Procurement',
    tenantId: adiaLux.id,
    id: intGuid(75),
  },
  {
    name: 'Property',
    tenantId: adiaLux.id,
    id: intGuid(76),
  },
  {
    name: 'Quality',
    tenantId: adiaLux.id,
    id: intGuid(77),
  },
  {
    name: 'Sales/BD',
    tenantId: adiaLux.id,
    id: intGuid(78),
  },
  {
    name: 'Services/Consulting',
    tenantId: adiaLux.id,
    id: intGuid(79),
  },
  {
    name: 'Supply Chain',
    tenantId: adiaLux.id,
    id: intGuid(80),
  },
  {
    name: 'Technology',
    tenantId: adiaLux.id,
    id: intGuid(81),
  },

  // adeccoSwi
  {
    name: 'Advisory',
    tenantId: adeccoSwi.id,
    id: intGuid(82),
  },
  {
    name: 'Audit',
    tenantId: adeccoSwi.id,
    id: intGuid(83),
  },
  {
    name: 'Banking / Financial Services',
    tenantId: adeccoSwi.id,
    id: intGuid(84),
  },
  {
    name: 'Construction',
    tenantId: adeccoSwi.id,
    id: intGuid(85),
  },
  {
    name: 'Engineering & Manu',
    tenantId: adeccoSwi.id,
    id: intGuid(86),
  },
  {
    name: 'Finance & Accounting',
    tenantId: adeccoSwi.id,
    id: intGuid(87),
  },
  {
    name: 'FMCG',
    tenantId: adeccoSwi.id,
    id: intGuid(88),
  },
  {
    name: 'Hospitality Chefs',
    tenantId: adeccoSwi.id,
    id: intGuid(89),
  },
  {
    name: 'Human Resources',
    tenantId: adeccoSwi.id,
    id: intGuid(90),
  },
  {
    name: 'Industrial Manufacturing',
    tenantId: adeccoSwi.id,
    id: intGuid(91),
  },
  {
    name: 'Insurance',
    tenantId: adeccoSwi.id,
    id: intGuid(92),
  },
  {
    name: 'Insurance non-life',
    tenantId: adeccoSwi.id,
    id: intGuid(93),
  },
  {
    name: 'Legal & Compliance',
    tenantId: adeccoSwi.id,
    id: intGuid(94),
  },
  {
    name: 'Legal in-House',
    tenantId: adeccoSwi.id,
    id: intGuid(95),
  },
  {
    name: 'Legal Law firms',
    tenantId: adeccoSwi.id,
    id: intGuid(96),
  },
  {
    name: 'Logistics',
    tenantId: adeccoSwi.id,
    id: intGuid(97),
  },
  {
    name: 'Marketing',
    tenantId: adeccoSwi.id,
    id: intGuid(98),
  },
  {
    name: 'Medical',
    tenantId: adeccoSwi.id,
    id: intGuid(99),
  },
  {
    name: 'NPO/Public Sector',
    tenantId: adeccoSwi.id,
    id: intGuid(100),
  },
  {
    name: 'Office support',
    tenantId: adeccoSwi.id,
    id: intGuid(101),
  },
  {
    name: 'Procurement',
    tenantId: adeccoSwi.id,
    id: intGuid(102),
  },
  {
    name: 'Property',
    tenantId: adeccoSwi.id,
    id: intGuid(103),
  },
  {
    name: 'Quality',
    tenantId: adeccoSwi.id,
    id: intGuid(104),
  },
  {
    name: 'Sales/BD',
    tenantId: adeccoSwi.id,
    id: intGuid(105),
  },
  {
    name: 'Services/Consulting',
    tenantId: adeccoSwi.id,
    id: intGuid(106),
  },
  {
    name: 'Supply Chain',
    tenantId: adeccoSwi.id,
    id: intGuid(107),
  },
  {
    name: 'Technology',
    tenantId: adeccoSwi.id,
    id: intGuid(108),
  },

  // genericSwi
  {
    name: 'Advisory',
    tenantId: genericSwi.id,
    id: intGuid(109),
  },
  {
    name: 'Audit',
    tenantId: genericSwi.id,
    id: intGuid(110),
  },
  {
    name: 'Banking / Financial Services',
    tenantId: genericSwi.id,
    id: intGuid(111),
  },
  {
    name: 'Construction',
    tenantId: genericSwi.id,
    id: intGuid(112),
  },
  {
    name: 'Engineering & Manu',
    tenantId: genericSwi.id,
    id: intGuid(113),
  },
  {
    name: 'Finance & Accounting',
    tenantId: genericSwi.id,
    id: intGuid(114),
  },
  {
    name: 'FMCG',
    tenantId: genericSwi.id,
    id: intGuid(115),
  },
  {
    name: 'Hospitality Chefs',
    tenantId: genericSwi.id,
    id: intGuid(116),
  },
  {
    name: 'Human Resources',
    tenantId: genericSwi.id,
    id: intGuid(117),
  },
  {
    name: 'Industrial Manufacturing',
    tenantId: genericSwi.id,
    id: intGuid(118),
  },
  {
    name: 'Insurance',
    tenantId: genericSwi.id,
    id: intGuid(119),
  },
  {
    name: 'Insurance non-life',
    tenantId: genericSwi.id,
    id: intGuid(120),
  },
  {
    name: 'Legal & Compliance',
    tenantId: genericSwi.id,
    id: intGuid(121),
  },
  {
    name: 'Legal in-House',
    tenantId: genericSwi.id,
    id: intGuid(122),
  },
  {
    name: 'Legal Law firms',
    tenantId: genericSwi.id,
    id: intGuid(123),
  },
  {
    name: 'Logistics',
    tenantId: genericSwi.id,
    id: intGuid(124),
  },
  {
    name: 'Marketing',
    tenantId: genericSwi.id,
    id: intGuid(125),
  },
  {
    name: 'Medical',
    tenantId: genericSwi.id,
    id: intGuid(126),
  },
  {
    name: 'NPO/Public Sector',
    tenantId: genericSwi.id,
    id: intGuid(127),
  },
  {
    name: 'Office support',
    tenantId: genericSwi.id,
    id: intGuid(128),
  },
  {
    name: 'Procurement',
    tenantId: genericSwi.id,
    id: intGuid(129),
  },
  {
    name: 'Property',
    tenantId: genericSwi.id,
    id: intGuid(130),
  },
  {
    name: 'Quality',
    tenantId: genericSwi.id,
    id: intGuid(131),
  },
  {
    name: 'Sales/BD',
    tenantId: genericSwi.id,
    id: intGuid(132),
  },
  {
    name: 'Services/Consulting',
    tenantId: genericSwi.id,
    id: intGuid(133),
  },
  {
    name: 'Supply Chain',
    tenantId: genericSwi.id,
    id: intGuid(134),
  },
  {
    name: 'Technology',
    tenantId: genericSwi.id,
    id: intGuid(135),
  },

  // adeccoGroupSwi
  {
    name: 'Advisory',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(136),
  },
  {
    name: 'Audit',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(137),
  },
  {
    name: 'Banking / Financial Services',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(138),
  },
  {
    name: 'Construction',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(139),
  },
  {
    name: 'Engineering & Manu',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(140),
  },
  {
    name: 'Finance & Accounting',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(141),
  },
  {
    name: 'FMCG',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(142),
  },
  {
    name: 'Hospitality Chefs',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(143),
  },
  {
    name: 'Human Resources',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(144),
  },
  {
    name: 'Industrial Manufacturing',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(145),
  },
  {
    name: 'Insurance',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(146),
  },
  {
    name: 'Insurance non-life',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(147),
  },
  {
    name: 'Legal & Compliance',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(148),
  },
  {
    name: 'Legal in-House',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(149),
  },
  {
    name: 'Legal Law firms',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(150),
  },
  {
    name: 'Logistics',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(151),
  },
  {
    name: 'Marketing',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(152),
  },
  {
    name: 'Medical',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(153),
  },
  {
    name: 'NPO/Public Sector',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(154),
  },
  {
    name: 'Office support',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(155),
  },
  {
    name: 'Procurement',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(156),
  },
  {
    name: 'Property',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(157),
  },
  {
    name: 'Quality',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(158),
  },
  {
    name: 'Sales/BD',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(159),
  },
  {
    name: 'Services/Consulting',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(160),
  },
  {
    name: 'Supply Chain',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(161),
  },
  {
    name: 'Technology',
    tenantId: adeccoGroupSwi.id,
    id: intGuid(162),
  },

  // badenochAndClarkSwi
  {
    name: 'Advisory',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(163),
  },
  {
    name: 'Audit',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(164),
  },
  {
    name: 'Banking / Financial Services',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(165),
  },
  {
    name: 'Construction',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(166),
  },
  {
    name: 'Engineering & Manu',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(167),
  },
  {
    name: 'Finance & Accounting',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(168),
  },
  {
    name: 'FMCG',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(169),
  },
  {
    name: 'Hospitality Chefs',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(170),
  },
  {
    name: 'Human Resources',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(171),
  },
  {
    name: 'Industrial Manufacturing',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(172),
  },
  {
    name: 'Insurance',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(173),
  },
  {
    name: 'Insurance non-life',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(174),
  },
  {
    name: 'Legal & Compliance',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(175),
  },
  {
    name: 'Legal in-House',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(176),
  },
  {
    name: 'Legal Law firms',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(177),
  },
  {
    name: 'Logistics',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(178),
  },
  {
    name: 'Marketing',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(179),
  },
  {
    name: 'Medical',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(180),
  },
  {
    name: 'NPO/Public Sector',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(181),
  },
  {
    name: 'Office support',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(182),
  },
  {
    name: 'Procurement',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(183),
  },
  {
    name: 'Property',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(184),
  },
  {
    name: 'Quality',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(185),
  },
  {
    name: 'Sales/BD',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(186),
  },
  {
    name: 'Services/Consulting',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(187),
  },
  {
    name: 'Supply Chain',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(188),
  },
  {
    name: 'Technology',
    tenantId: badenochAndClarkSwi.id,
    id: intGuid(189),
  },

  // pontoonSwi
  {
    name: 'Advisory',
    tenantId: pontoonSwi.id,
    id: intGuid(190),
  },
  {
    name: 'Audit',
    tenantId: pontoonSwi.id,
    id: intGuid(191),
  },
  {
    name: 'Banking / Financial Services',
    tenantId: pontoonSwi.id,
    id: intGuid(192),
  },
  {
    name: 'Construction',
    tenantId: pontoonSwi.id,
    id: intGuid(193),
  },
  {
    name: 'Engineering & Manu',
    tenantId: pontoonSwi.id,
    id: intGuid(194),
  },
  {
    name: 'Finance & Accounting',
    tenantId: pontoonSwi.id,
    id: intGuid(195),
  },
  {
    name: 'FMCG',
    tenantId: pontoonSwi.id,
    id: intGuid(196),
  },
  {
    name: 'Hospitality Chefs',
    tenantId: pontoonSwi.id,
    id: intGuid(197),
  },
  {
    name: 'Human Resources',
    tenantId: pontoonSwi.id,
    id: intGuid(198),
  },
  {
    name: 'Industrial Manufacturing',
    tenantId: pontoonSwi.id,
    id: intGuid(199),
  },
  {
    name: 'Insurance',
    tenantId: pontoonSwi.id,
    id: intGuid(200),
  },
  {
    name: 'Insurance non-life',
    tenantId: pontoonSwi.id,
    id: intGuid(201),
  },
  {
    name: 'Legal & Compliance',
    tenantId: pontoonSwi.id,
    id: intGuid(202),
  },
  {
    name: 'Legal in-House',
    tenantId: pontoonSwi.id,
    id: intGuid(203),
  },
  {
    name: 'Legal Law firms',
    tenantId: pontoonSwi.id,
    id: intGuid(204),
  },
  {
    name: 'Logistics',
    tenantId: pontoonSwi.id,
    id: intGuid(205),
  },
  {
    name: 'Marketing',
    tenantId: pontoonSwi.id,
    id: intGuid(206),
  },
  {
    name: 'Medical',
    tenantId: pontoonSwi.id,
    id: intGuid(207),
  },
  {
    name: 'NPO/Public Sector',
    tenantId: pontoonSwi.id,
    id: intGuid(208),
  },
  {
    name: 'Office support',
    tenantId: pontoonSwi.id,
    id: intGuid(209),
  },
  {
    name: 'Procurement',
    tenantId: pontoonSwi.id,
    id: intGuid(210),
  },
  {
    name: 'Property',
    tenantId: pontoonSwi.id,
    id: intGuid(211),
  },
  {
    name: 'Quality',
    tenantId: pontoonSwi.id,
    id: intGuid(212),
  },
  {
    name: 'Sales/BD',
    tenantId: pontoonSwi.id,
    id: intGuid(213),
  },
  {
    name: 'Services/Consulting',
    tenantId: pontoonSwi.id,
    id: intGuid(214),
  },
  {
    name: 'Supply Chain',
    tenantId: pontoonSwi.id,
    id: intGuid(215),
  },
  {
    name: 'Technology',
    tenantId: pontoonSwi.id,
    id: intGuid(216),
  },

  // springProSwi
  {
    name: 'Advisory',
    tenantId: springProSwi.id,
    id: intGuid(217),
  },
  {
    name: 'Audit',
    tenantId: springProSwi.id,
    id: intGuid(218),
  },
  {
    name: 'Banking / Financial Services',
    tenantId: springProSwi.id,
    id: intGuid(219),
  },
  {
    name: 'Construction',
    tenantId: springProSwi.id,
    id: intGuid(220),
  },
  {
    name: 'Engineering & Manu',
    tenantId: springProSwi.id,
    id: intGuid(221),
  },
  {
    name: 'Finance & Accounting',
    tenantId: springProSwi.id,
    id: intGuid(222),
  },
  {
    name: 'FMCG',
    tenantId: springProSwi.id,
    id: intGuid(223),
  },
  {
    name: 'Hospitality Chefs',
    tenantId: springProSwi.id,
    id: intGuid(224),
  },
  {
    name: 'Human Resources',
    tenantId: springProSwi.id,
    id: intGuid(225),
  },
  {
    name: 'Industrial Manufacturing',
    tenantId: springProSwi.id,
    id: intGuid(226),
  },
  {
    name: 'Insurance',
    tenantId: springProSwi.id,
    id: intGuid(227),
  },
  {
    name: 'Insurance non-life',
    tenantId: springProSwi.id,
    id: intGuid(228),
  },
  {
    name: 'Legal & Compliance',
    tenantId: springProSwi.id,
    id: intGuid(229),
  },
  {
    name: 'Legal in-House',
    tenantId: springProSwi.id,
    id: intGuid(230),
  },
  {
    name: 'Legal Law firms',
    tenantId: springProSwi.id,
    id: intGuid(231),
  },
  {
    name: 'Logistics',
    tenantId: springProSwi.id,
    id: intGuid(232),
  },
  {
    name: 'Marketing',
    tenantId: springProSwi.id,
    id: intGuid(233),
  },
  {
    name: 'Medical',
    tenantId: springProSwi.id,
    id: intGuid(234),
  },
  {
    name: 'NPO/Public Sector',
    tenantId: springProSwi.id,
    id: intGuid(235),
  },
  {
    name: 'Office support',
    tenantId: springProSwi.id,
    id: intGuid(236),
  },
  {
    name: 'Procurement',
    tenantId: springProSwi.id,
    id: intGuid(237),
  },
  {
    name: 'Property',
    tenantId: springProSwi.id,
    id: intGuid(238),
  },
  {
    name: 'Quality',
    tenantId: springProSwi.id,
    id: intGuid(239),
  },
  {
    name: 'Sales/BD',
    tenantId: springProSwi.id,
    id: intGuid(240),
  },
  {
    name: 'Services/Consulting',
    tenantId: springProSwi.id,
    id: intGuid(241),
  },
  {
    name: 'Supply Chain',
    tenantId: springProSwi.id,
    id: intGuid(242),
  },
  {
    name: 'Technology',
    tenantId: springProSwi.id,
    id: intGuid(243),
  },

  // adeccoUsa
  {
    name: 'Advisory',
    tenantId: adeccoUsa.id,
    id: intGuid(244),
  },
  {
    name: 'Audit',
    tenantId: adeccoUsa.id,
    id: intGuid(245),
  },
  {
    name: 'Banking / Financial Services',
    tenantId: adeccoUsa.id,
    id: intGuid(246),
  },
  {
    name: 'Construction',
    tenantId: adeccoUsa.id,
    id: intGuid(247),
  },
  {
    name: 'Engineering & Manu',
    tenantId: adeccoUsa.id,
    id: intGuid(248),
  },
  {
    name: 'Finance & Accounting',
    tenantId: adeccoUsa.id,
    id: intGuid(249),
  },
  {
    name: 'FMCG',
    tenantId: adeccoUsa.id,
    id: intGuid(250),
  },
  {
    name: 'Hospitality Chefs',
    tenantId: adeccoUsa.id,
    id: intGuid(251),
  },
  {
    name: 'Human Resources',
    tenantId: adeccoUsa.id,
    id: intGuid(252),
  },
  {
    name: 'Industrial Manufacturing',
    tenantId: adeccoUsa.id,
    id: intGuid(253),
  },
  {
    name: 'Insurance',
    tenantId: adeccoUsa.id,
    id: intGuid(254),
  },
  {
    name: 'Insurance non-life',
    tenantId: adeccoUsa.id,
    id: intGuid(255),
  },
  {
    name: 'Legal & Compliance',
    tenantId: adeccoUsa.id,
    id: intGuid(256),
  },
  {
    name: 'Legal in-House',
    tenantId: adeccoUsa.id,
    id: intGuid(257),
  },
  {
    name: 'Legal Law firms',
    tenantId: adeccoUsa.id,
    id: intGuid(258),
  },
  {
    name: 'Logistics',
    tenantId: adeccoUsa.id,
    id: intGuid(259),
  },
  {
    name: 'Marketing',
    tenantId: adeccoUsa.id,
    id: intGuid(260),
  },
  {
    name: 'Medical',
    tenantId: adeccoUsa.id,
    id: intGuid(261),
  },
  {
    name: 'NPO/Public Sector',
    tenantId: adeccoUsa.id,
    id: intGuid(262),
  },
  {
    name: 'Office support',
    tenantId: adeccoUsa.id,
    id: intGuid(263),
  },
  {
    name: 'Procurement',
    tenantId: adeccoUsa.id,
    id: intGuid(264),
  },
  {
    name: 'Property',
    tenantId: adeccoUsa.id,
    id: intGuid(265),
  },
  {
    name: 'Quality',
    tenantId: adeccoUsa.id,
    id: intGuid(266),
  },
  {
    name: 'Sales/BD',
    tenantId: adeccoUsa.id,
    id: intGuid(267),
  },
  {
    name: 'Services/Consulting',
    tenantId: adeccoUsa.id,
    id: intGuid(268),
  },
  {
    name: 'Supply Chain',
    tenantId: adeccoUsa.id,
    id: intGuid(269),
  },
  {
    name: 'Technology',
    tenantId: adeccoUsa.id,
    id: intGuid(270),
  },

  // LHHSwi
  {
    name: 'Advisory',
    tenantId: lhhSwi.id,
    id: intGuid(271),
  },
  {
    name: 'Audit',
    tenantId: lhhSwi.id,
    id: intGuid(272),
  },
  {
    name: 'Banking / Financial Services',
    tenantId: lhhSwi.id,
    id: intGuid(273),
  },
  {
    name: 'Construction',
    tenantId: lhhSwi.id,
    id: intGuid(274),
  },
  {
    name: 'Engineering & Manu',
    tenantId: lhhSwi.id,
    id: intGuid(275),
  },
  {
    name: 'Finance & Accounting',
    tenantId: lhhSwi.id,
    id: intGuid(276),
  },
  {
    name: 'FMCG',
    tenantId: lhhSwi.id,
    id: intGuid(277),
  },
  {
    name: 'Hospitality Chefs',
    tenantId: lhhSwi.id,
    id: intGuid(278),
  },
  {
    name: 'Human Resources',
    tenantId: lhhSwi.id,
    id: intGuid(279),
  },
  {
    name: 'Industrial Manufacturing',
    tenantId: lhhSwi.id,
    id: intGuid(280),
  },
  {
    name: 'Insurance',
    tenantId: lhhSwi.id,
    id: intGuid(281),
  },
  {
    name: 'Insurance non-life',
    tenantId: lhhSwi.id,
    id: intGuid(282),
  },
  {
    name: 'Legal & Compliance',
    tenantId: lhhSwi.id,
    id: intGuid(283),
  },
  {
    name: 'Legal in-House',
    tenantId: lhhSwi.id,
    id: intGuid(284),
  },
  {
    name: 'Legal Law firms',
    tenantId: lhhSwi.id,
    id: intGuid(285),
  },
  {
    name: 'Logistics',
    tenantId: lhhSwi.id,
    id: intGuid(286),
  },
  {
    name: 'Marketing',
    tenantId: lhhSwi.id,
    id: intGuid(287),
  },
  {
    name: 'Medical',
    tenantId: lhhSwi.id,
    id: intGuid(288),
  },
  {
    name: 'NPO/Public Sector',
    tenantId: lhhSwi.id,
    id: intGuid(289),
  },
  {
    name: 'Office support',
    tenantId: lhhSwi.id,
    id: intGuid(290),
  },
  {
    name: 'Procurement',
    tenantId: lhhSwi.id,
    id: intGuid(291),
  },
  {
    name: 'Property',
    tenantId: lhhSwi.id,
    id: intGuid(292),
  },
  {
    name: 'Quality',
    tenantId: lhhSwi.id,
    id: intGuid(293),
  },
  {
    name: 'Sales/BD',
    tenantId: lhhSwi.id,
    id: intGuid(294),
  },
  {
    name: 'Services/Consulting',
    tenantId: lhhSwi.id,
    id: intGuid(295),
  },
  {
    name: 'Supply Chain',
    tenantId: lhhSwi.id,
    id: intGuid(296),
  },
  {
    name: 'Technology',
    tenantId: lhhSwi.id,
    id: intGuid(297),
  },
];
