import AuthForm from "./AuthForm";

function Login({
  setUserEmail,
  setLoggedIn,
  navigate,
  onInfoTooltipOpen,
  handleAuthorizationUser,
}) {
  /* function handleAuthorizationUser(userData) {
    auth
      .getAuthorizationUser(userData)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setLoggedIn(true);
          setUserEmail(userData.email);
          navigate("/");
        }
      })
      .catch(() => onInfoTooltipOpen({ isOpen: true, status: false }));
  } */

  return (
    <AuthForm
      title="Вход"
      btnText="Вход"
      handleSubmit={handleAuthorizationUser}
    />
  );
}

export default Login;
