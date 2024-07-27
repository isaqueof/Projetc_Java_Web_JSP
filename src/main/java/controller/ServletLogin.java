package controller;

import java.io.IOException;
import java.io.Serial;
import dao.DAOLoginRepository;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.ModelLogin;

@WebServlet(urlPatterns = { "/principal/ServletLogin", "/ServletLogin"})
public class ServletLogin extends HttpServlet {

    @Serial
    private static final long serialVersionUID = 1L;

    private final DAOLoginRepository daoLoginRepository = new DAOLoginRepository();

    public ServletLogin() {
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        System.out.println("Inside doGet method");

        String acao = request.getParameter("acao");

        if (acao != null && acao.equalsIgnoreCase("logout")) {
            request.getSession().invalidate();// invalida a sessão
            RequestDispatcher redirecionar = request.getRequestDispatcher("/login.jsp");
            redirecionar.forward(request, response);
        } else {
            doPost(request, response);
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        System.out.println("Inside doPost method");

        String uname = request.getParameter("uname");
        String psw = request.getParameter("psw");
        String url = request.getParameter("url");

        System.out.println("Username: " + uname);
        System.out.println("Password: " + psw);
        System.out.println("URL: " + url);

        try {
            if (uname != null && !uname.isEmpty() && psw != null && !psw.isEmpty()) {

                ModelLogin modelLogin = new ModelLogin();
                modelLogin.setUname(uname);
                modelLogin.setPsw(psw);

                if (daoLoginRepository.validarAutenticacao(modelLogin)) {
                    System.out.println("User authenticated successfully.");
                    request.getSession().setAttribute("usuario", modelLogin.getUname());

                    if (url == null || url.equals("null")) {
                        url = "principal/pagePrincipal.jsp";
                    }

                    RequestDispatcher dispatcher = request.getRequestDispatcher(url);
                    request.setAttribute("msg2", "Senha: " + psw);
                    dispatcher.forward(request, response);

                } else {
                    System.out.println("Invalid login or password.");
                    RequestDispatcher dispatcher = request.getRequestDispatcher("/login.jsp");
                    request.setAttribute("msg", "Login ou senha incorretos!");
                    dispatcher.forward(request, response);
                }

            } else {
                System.out.println("Username or password is empty.");
                RequestDispatcher dispatcher = request.getRequestDispatcher("/login.jsp");
                request.setAttribute("msg", "Informe o Login e senha corretamente!");
                dispatcher.forward(request, response);
            }

        } catch (Exception e) {
            e.printStackTrace();
            RequestDispatcher redirecionar = request.getRequestDispatcher("/error.jsp");
            request.setAttribute("msg", e.getMessage());
            redirecionar.forward(request, response);
        }
    }
}
