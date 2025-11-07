import { useState } from 'react';
import './Menu.scss';
import MenuIcon from "../../assets/menu.svg";
import { MENU_NAVIGATION } from '../../configs/menu-navigation.ts';
import { useNavigate } from 'react-router';

const Menu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`Menu ${isOpen ? 'Menu--open' : ''}`}>
      <div className="Menu__button__wrapper">
        <img
          src={MenuIcon}
          className="Menu__logo"
          alt="menu"
          onClick={() => setIsOpen((prev) => !prev)}
        />
      </div>
      <div className="Menu__divider" />
      <div className="Menu__list">
        {MENU_NAVIGATION.map(({ path, label, icon }) => (
          <div className={`Menu__list__item ${isOpen ? 'Menu--open' : ''}`} onClick={() => navigate(path)}>
            <img className="Menu__logo" src={icon} alt={label} />
            <p>{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu;
