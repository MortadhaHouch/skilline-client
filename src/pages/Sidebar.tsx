import { NavLink } from 'react-router-dom';
import { userLinks } from '../../utils/constants';
import { User } from '../../utils/types';
import clsx from 'clsx';
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from 'react-icons/tb';
import { useState } from 'react';
import { motion, } from 'framer-motion';

export default function Sidebar({ user }: { user: User }) {
  const [isShown, setIsShown] = useState(false);
  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: isShown ? 0 : -250 }}
      exit={{ x: -250 }}
      className="fixed top-0 left-0 w-64 h-screen flex flex-col justify-start items-center z-40 bg-slate-400 dark:bg-slate-700 backdrop-blur-lg backdrop-opacity-75 pt-20 shadow-lg"
    >
      <motion.button
        onClick={() => setIsShown((v) => !v)}
        className="absolute top-16 -right-2 bg-slate-500 rounded-2xl p-2 transition-transform duration-300 hover:bg-slate-600"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isShown ? 180 : 0 }}
        aria-label={isShown ? 'Collapse Sidebar' : 'Expand Sidebar'}
      >
        {isShown ? (
          <TbLayoutSidebarLeftExpand size={20} />
        ) : (
          <TbLayoutSidebarLeftCollapse size={20} />
        )}
      </motion.button>

      {user.avatar ? (
        <motion.img
          src={user.avatar}
          className="w-24 h-24 rounded-full border-4 border-slate-500 hover:border-slate-600 transition-all duration-300"
          alt="User Avatar"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
      ) : (
        <motion.p
          className="w-24 h-24 rounded-full bg-gray-400 flex justify-center items-center text-3xl select-none border-4 border-slate-500 hover:border-slate-600 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          {user.firstName.charAt(0).toUpperCase()}
          {user.lastName.charAt(0).toUpperCase()}
        </motion.p>
      )}

      <h2 className="w-full text-2xl pl-3 mt-4 font-semibold text-slate-800 dark:text-slate-100">
        {user.firstName} {user.lastName}
      </h2>
      <h4 className="w-full text-md pl-3 opacity-75 text-slate-700 dark:text-slate-300">
        {user.email}
      </h4>

      <ul className="flex flex-col gap-2 w-full mt-4 px-2">
        {userLinks.map((link, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, delay: idx * 0.05, ease: 'easeInOut' }}
            className="w-full"
          >
            <NavLink
              className={({ isActive }) =>
                clsx(
                  'flex flex-col justify-start items-center gap-2 py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-slate-500/30 relative',
                  isActive && 'bg-slate-500/50'
                )
              }
              to={link.path}
            >
              <div className="flex flex-row justify-start items-center gap-2 w-full">
                {link.icon && <link.icon size={20} />}
                <span>{link.title}</span>
              </div>
            </NavLink>
          </motion.li>
        ))}
      </ul>
    </motion.aside>
  );
}