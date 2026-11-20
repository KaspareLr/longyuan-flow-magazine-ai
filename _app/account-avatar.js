/* The project ships nine local account portraits. Assign one per demo account. */
(() => {
  const pool = Array.from({length:9}, (_, index) =>
    'assets/account-avatars/avatar-' + String(index + 1).padStart(2, '0') + '.png');
  window.qikanAccountAvatar = (profile, read, write) => {
    if (!profile) return profile;
    const id = profile.dsuId || profile.email?.trim().toLowerCase() || profile.nickname.trim().toLowerCase();
    const key = 'qikan-avatar:' + id;
    const saved = read(key, null);
    const avatar = [profile.avatar, saved].find(path => pool.includes(path)) ||
      pool[Math.floor(Math.random() * pool.length)];
    if (saved !== avatar) write(key, avatar);
    return profile.avatar === avatar ? profile : {...profile, avatar};
  };
})();
