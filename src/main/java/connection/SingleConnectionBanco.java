package connection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class SingleConnectionBanco {

    private static final String URL = "jdbc:postgresql://localhost:5432/progJsp?autoReconnect=true";
    private static final String USER = "postgres";
    private static final String PASSWORD = "admin";
    private static Connection connection = null;

    static {
        conectar();
    }

    private SingleConnectionBanco() {
        conectar();
    }

    public static Connection getConnection() {
        return connection;
    }

    private static void conectar() {
        try {
            if (connection == null || connection.isClosed()) {
                Class.forName("org.postgresql.Driver");
                connection = DriverManager.getConnection(URL, USER, PASSWORD);
                connection.setAutoCommit(false);
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            throw new RuntimeException("Erro ao conectar com o banco de dados", e);
        }
    }
}
