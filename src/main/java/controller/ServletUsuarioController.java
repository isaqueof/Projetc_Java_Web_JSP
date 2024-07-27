package controller;

import java.io.IOException;
import dao.DAOLoginRepository;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.ModelLogin;

@WebServlet(urlPatterns = { "/ServletUsuarioController" })
public class ServletUsuarioController extends HttpServlet {

    private static final long serialVersionUID = 1L;

    static DAOLoginRepository daoLoginRepository = new DAOLoginRepository();

    public ServletUsuarioController() {
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        try {
            String nome = request.getParameter("nome");
            String email = request.getParameter("email");
            String uname = request.getParameter("uname");
            String psw = request.getParameter("psw");

            ModelLogin modelLogin = new ModelLogin();
            modelLogin.setNome(nome);
            modelLogin.setEmail(email);
            modelLogin.setUname(uname);
            modelLogin.setPsw(psw);

            daoLoginRepository.cadastrarUsuario(modelLogin);

            request.setAttribute("msg", "Usuário cadastrado com sucesso!");
            RequestDispatcher dispatcher = request.getRequestDispatcher("/register.jsp");
            dispatcher.forward(request, response);

        } catch (Exception e) {
            e.printStackTrace();
            RequestDispatcher redirecionar = request.getRequestDispatcher("/error.jsp");
            request.setAttribute("msg", e.getMessage());
            redirecionar.forward(request, response);
        }
    }
}
