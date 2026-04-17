document.addEventListener('DOMContentLoaded', () => {

  // ── Init Auth Modal ────────────────────────
  AuthModal.init();

  // ── Navbar Login / Register / Logout buttons
  const loginBtn    = document.getElementById('navLoginBtn');
  const registerBtn = document.getElementById('navRegisterBtn');
  const logoutBtn   = document.getElementById('logoutBtn');
  const navUser     = document.getElementById('navUser');
  const navRole     = document.getElementById('navRole');

  // ── Update navbar based on login state ────
  function updateNavbar() {
    const user     = TokenManager.getUser();
    const loggedIn = TokenManager.isLoggedIn();

    if (loginBtn)    loginBtn.style.display    = loggedIn ? 'none'         : 'inline-flex';
    if (registerBtn) registerBtn.style.display = loggedIn ? 'none'         : 'inline-flex';
    if (logoutBtn)   logoutBtn.style.display   = loggedIn ? 'inline-flex'  : 'none';
    if (navUser)     navUser.textContent        = loggedIn ? user?.fullName : '';
    if (navRole && user) {
      navRole.textContent = loggedIn ? user.role : '';
      navRole.className   = loggedIn ? `badge badge-${user.role.toLowerCase()}` : 'badge';
    }
  }

  updateNavbar();

  // ── Navbar button event listeners ─────────
  if (loginBtn)    loginBtn.addEventListener('click',    () => AuthModal.open('login'));
  if (registerBtn) registerBtn.addEventListener('click', () => AuthModal.open('register'));
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      TokenManager.remove();
      TokenManager.removeUser();
      window.location.reload();
    });
  }

  // ── Modal tab switching ────────────────────
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t  => t.classList.remove('active'));
      document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.form).classList.add('active');
    });
  });

  // ── Role selection ─────────────────────────
  let selectedRole = 'USER';
  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedRole = btn.dataset.role;
    });
  });

  // ── Modal close button ─────────────────────
  const closeBtn = document.getElementById('modalClose');
  if (closeBtn) closeBtn.addEventListener('click', () => AuthModal.close());

  // ── LOGIN Form ─────────────────────────────
  const loginForm    = document.getElementById('loginForm');
  const loginAlert   = document.getElementById('loginAlert');
  const loginSubmit  = document.getElementById('loginSubmitBtn');
  const loginSpinner = document.getElementById('loginSpinner');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert(loginAlert);

      const email    = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      if (!email)    return showAlert(loginAlert, 'Email is required.');
      if (!password) return showAlert(loginAlert, 'Password is required.');

      setLoading(loginSubmit, loginSpinner, true);
      const result = await AuthAPI.login(email, password);
      setLoading(loginSubmit, loginSpinner, false);

      if (result.success) {
        TokenManager.set(result.data.token);
        TokenManager.setUser({
          fullName: result.data.fullName,
          email:    result.data.email,
          role:     result.data.role
        });
        AuthModal.close();
        updateNavbar();
        // Trigger page refresh to load authorized content
        if (typeof onAuthSuccess === 'function') onAuthSuccess();
        else window.location.reload();
      } else {
        showAlert(loginAlert, result.error);
      }
    });
  }

  // ── REGISTER Form ──────────────────────────
  const registerForm    = document.getElementById('registerForm');
  const registerAlert   = document.getElementById('registerAlert');
  const registerSubmit  = document.getElementById('registerSubmitBtn');
  const registerSpinner = document.getElementById('registerSpinner');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert(registerAlert);

      const fullName = document.getElementById('regName').value.trim();
      const email    = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;

      if (!fullName)            return showAlert(registerAlert, 'Full name is required.');
      if (!email)               return showAlert(registerAlert, 'Email is required.');
      if (!email.includes('@')) return showAlert(registerAlert, 'Enter a valid email address.');
      if (password.length < 6)  return showAlert(registerAlert, 'Password must be at least 6 characters.');

      setLoading(registerSubmit, registerSpinner, true);
      const result = await AuthAPI.register(fullName, email, password, selectedRole);
      setLoading(registerSubmit, registerSpinner, false);

      if (result.success) {
        TokenManager.set(result.data.token);
        TokenManager.setUser({
          fullName: result.data.fullName,
          email:    result.data.email,
          role:     result.data.role
        });
        AuthModal.close();
        updateNavbar();
        if (typeof onAuthSuccess === 'function') onAuthSuccess();
        else window.location.reload();
      } else {
        showAlert(registerAlert, result.error);
      }
    });
  }
});