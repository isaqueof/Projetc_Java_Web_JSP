package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import connection.SingleConnectionBanco;
import model.ModelLogin;
import org.mindrot.jbcrypt.BCrypt;

public class DAOLoginRepository {

    private Connection connection;

    public DAOLoginRepository() {
        connection = SingleConnectionBanco.getConnection();
    }

    public boolean validarAutenticacao(ModelLogin modelLogin) {
        try {
        	String sql = "select * from public.\"modelLogin\" where upper(uname) = upper(?) and upper(psw) = upper(?)";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, modelLogin.getUname());
            preparedStatement.setString(2, modelLogin.getPsw());

            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
               return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public void cadastrarUsuario(ModelLogin modelLogin) {
        try {
            String sql = "INSERT INTO public.\"modelLogin\" (uname, psw, nome, email) VALUES (?, ?, ?, ?)";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, modelLogin.getUname());
            preparedStatement.setString(2, BCrypt.hashpw(modelLogin.getPsw(), BCrypt.gensalt()));
            preparedStatement.setString(3, modelLogin.getNome());
            preparedStatement.setString(4, modelLogin.getEmail());
            preparedStatement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}





