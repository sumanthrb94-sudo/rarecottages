/**
 * The single source of icons for the site: Tabler Icons (MIT, 5,900+ icons in
 * outline and filled styles, including brand marks). Import icons from here
 * rather than from '@tabler/icons-react' directly so the set stays consistent.
 *
 * Usage: <IconBed size={20} stroke={1.75} />
 */
import {
  IconBed,
  IconClockHour4,
  IconConfetti,
  IconGlassChampagne,
  type Icon,
} from '@tabler/icons-react';
import type { CategorySlug } from '../../data/types';

export {
  IconAdjustmentsHorizontal,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconBed,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconBrush,
  IconCake,
  IconCalendar,
  IconCalendarEvent,
  IconCamera,
  IconCar,
  IconCarFilled,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconCircleCheckFilled,
  IconClockHour4,
  IconConfetti,
  IconCurrencyRupee,
  IconDots,
  IconFlower,
  IconGift,
  IconGiftFilled,
  IconGlassChampagne,
  IconHeart,
  IconHome,
  IconHomeFilled,
  IconInfoCircle,
  IconLayoutGrid,
  IconLayoutGridFilled,
  IconMail,
  IconMapPin,
  IconMapPinFilled,
  IconMessageCircle,
  IconMessageCircleFilled,
  IconMinus,
  IconMoon,
  IconPhone,
  IconPhoto,
  IconPlus,
  IconPool,
  IconSearch,
  IconShieldCheck,
  IconSparkles,
  IconSun,
  IconToolsKitchen2,
  IconTrees,
  IconUser,
  IconUsers,
  IconUsersGroup,
  IconVideo,
  IconWand,
  IconX,
} from '@tabler/icons-react';
export type { Icon } from '@tabler/icons-react';

/** One icon per service, used everywhere the service appears. */
export const serviceIcons: Record<CategorySlug, Icon> = {
  'night-stay': IconBed,
  'hourly-stay': IconClockHour4,
  'party-space': IconConfetti,
  'event-space': IconGlassChampagne,
};
