export const formatNumber = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const toCapitalize = (x) => {
  return x[0].toUpperCase() + x.substr(1).toLowerCase();
};

export const getWarriorGif = (x, y) => {
  switch (x){
    case 'Hobbit':
      if (y >= 500 && y < 600)
        return 'w1-hobbit-90.gif';
      else if (y >= 600 && y < 700)
        return 'w1-hobbit-95.gif';
      else if (y >= 700 && y < 800)
        return 'w1-hobbit-100.gif';
      else if (y >= 800 && y < 900)
        return 'w1-hobbit-105.gif';
      else 
        return 'w1-hobbit-110.gif';
    case 'Gnome':
      if (y >= 1000 && y < 1200)
        return 'w2-gnome-90.gif';
      else if (y >= 1200 && y < 1400)
        return 'w2-gnome-95.gif';
      else if (y >= 1400 && y < 1600)
        return 'w2-gnome-100.gif';
      else if (y >= 1600 && y < 1800)
        return 'w2-gnome-105.gif';
      else 
        return 'w2-gnome-110.gif';
    case 'Satyr':
      if (y >= 2000 && y < 2200)
        return 'w3-satyr-90.gif';
      else if (y >= 2200 && y < 2400)
        return 'w3-satyr-95.gif';
      else if (y >= 2400 && y < 2600)
        return 'w3-satyr-100.gif';
      else if (y >= 2600 && y < 2800)
        return 'w3-satyr-105.gif';
      else 
        return 'w3-satyr-110.gif';
    case 'Dwarf':
      if (y >= 3000 && y < 3200)
        return 'w4-dwarf-90.gif';
      else if (y >= 3200 && y < 3400)
        return 'w4-dwarf-95.gif';
      else if (y >= 3400 && y < 3600)
        return 'w4-dwarf-100.gif';
      else if (y >= 3600 && y < 3800)
        return 'w4-dwarf-105.gif';
      else 
        return 'w4-dwarf-110.gif';
    case 'Minotaur':
      if (y >= 4000 && y < 4400)
        return 'w5-minotaur-90.gif';
      else if (y >= 4400 && y < 4800)
        return 'w5-minotaur-95.gif';
      else if (y >= 4800 && y < 5200)
        return 'w5-minotaur-100.gif';
      else if (y >= 5200 && y < 5600)
        return 'w5-minotaur-105.gif';
      else 
        return 'w5-minotaur-110.gif';
    case 'Dragon':
      if (y >= 50000 && y < 52000)
        return 'w6-dragon-90.gif';
      else if (y >= 52000 && y < 54000)
        return 'w6-dragon-95.gif';
      else if (y >= 54000 && y < 56000)
        return 'w6-dragon-100.gif';
      else if (y >= 56000 && y < 58000)
        return 'w6-dragon-105.gif';
      else 
        return 'w6-dragon-110.gif';
    default:
      return '';
  }
};

export const getBeastGif = (x) => {
  let variables = ['90', '95', '100', '105', '110'];
  switch (x){
    case 1:
      return 'b1-centaur-' + variables[Math.floor(Math.random() * 5)] + '.gif';
    case 2:
      return 'b2-barghest-' + variables[Math.floor(Math.random() * 5)] + '.gif';
    case 3:
      return 'b3-pegasus-' + variables[Math.floor(Math.random() * 5)] + '.gif';
    case 4:
      return 'b4-griffin-' + variables[Math.floor(Math.random() * 5)] + '.gif';
    case 5:
      return 'b5-dragon-' + variables[Math.floor(Math.random() * 5)] + '.gif';
    case 20:
      return 'b6-phoenix-' + variables[Math.floor(Math.random() * 5)] + '.gif';
    default:
      return '';
  }
};