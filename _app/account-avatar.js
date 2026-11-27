/* The project ships nine local account portraits. Assign one per demo account. */
(() => {
  const avatarPaths = {"assets/account-avatars/avatar-01.png": "https://kasparelr.github.io/agentui-shared-images/objects/20/2047cf58b0fcf9f015015f508dabd79a889151f5ccd9ca607c372b6ac648440a.png", "assets/account-avatars/avatar-02.png": "https://kasparelr.github.io/agentui-shared-images/objects/8c/8c4098f744ef0a119bf98e8e8addfdedaac661dd7ab38bf78abc4c7a9a16d3ca.png", "assets/account-avatars/avatar-03.png": "https://kasparelr.github.io/agentui-shared-images/objects/b0/b0afded66e3a8cfce7c6a57373136a06e9eb40a51d32027192b30759c6b96a57.png", "assets/account-avatars/avatar-04.png": "https://kasparelr.github.io/agentui-shared-images/objects/a5/a596b0427d0101447e2e21e8ae13112fa3e4e36fae1f7b16dbfb29a7b9ba8df6.png", "assets/account-avatars/avatar-05.png": "https://kasparelr.github.io/agentui-shared-images/objects/f4/f4ffa7b89a9be72faa7803a971781691365e28775162659901dca6ec5594a4f6.png", "assets/account-avatars/avatar-06.png": "https://kasparelr.github.io/agentui-shared-images/objects/c0/c02679b6e08e8c63a0193d032141f9ded943de1d42054b83f16987ef18691016.png", "assets/account-avatars/avatar-07.png": "https://kasparelr.github.io/agentui-shared-images/objects/a7/a757aece802b380ea38b0e01bc8096898886e7fa7883fbab31c79025c9522342.png", "assets/account-avatars/avatar-08.png": "https://kasparelr.github.io/agentui-shared-images/objects/8c/8cea5f4e5655278849200e415eee505bf03ec14a072c5d8deaee04465a89a765.png", "assets/account-avatars/avatar-09.png": "https://kasparelr.github.io/agentui-shared-images/objects/ed/edcb317dabd8f31b5c600feec75fa5ef153807c61651b001997cec8633b63e8d.png"};
  const pool = Object.values(avatarPaths);
  window.qikanAccountAvatar = (profile, read, write) => {
    if (!profile) return profile;
    const id = profile.dsuId || profile.email?.trim().toLowerCase() || profile.nickname.trim().toLowerCase();
    const key = 'qikan-avatar:' + id;
    const saved = read(key, null);
    const avatar = [profile.avatar, saved].map(path => avatarPaths[path] || path).find(path => pool.includes(path) || /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(path)) ||
      pool[Math.floor(Math.random() * pool.length)];
    if (saved !== avatar) write(key, avatar);
    return profile.avatar === avatar ? profile : {...profile, avatar};
  };
})();
