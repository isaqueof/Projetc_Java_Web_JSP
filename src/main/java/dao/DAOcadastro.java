package dao;

import connection.SingleConnectionBanco;
import model.ModelCadastro;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class DAOcadastro {

	private final Connection connection;

	public DAOcadastro() {
		connection = SingleConnectionBanco.getConnection();
	}

	public void gravarCadastro(ModelCadastro objeto) throws SQLException {
		if (objeto.isNovo()) {
			inserirCadastro(objeto);
		} else {
			atualizarCadastro(objeto);
		}
	}

	private void inserirCadastro(ModelCadastro objeto) throws SQLException {
		String sql = "INSERT INTO cadastro (centrodecusto, funcao, nome, datanascimento, cpf, rg, aso, dataaso, filePath) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
		try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
			preparedStatement.setString(1, objeto.getCentrodecusto());
			preparedStatement.setString(2, objeto.getFuncao());
			preparedStatement.setString(3, objeto.getNome());
			preparedStatement.setString(4, objeto.getDatanascimento());
			preparedStatement.setString(5, objeto.getCpf());
			preparedStatement.setString(6, objeto.getRg());
			preparedStatement.setString(7, objeto.getAso());
			preparedStatement.setString(8, objeto.getDataaso());
			preparedStatement.setString(9, objeto.getFilePath());

			preparedStatement.executeUpdate();
			connection.commit();
			System.out.println("Cadastro inserido com sucesso!");
		} catch (SQLException e) {
			connection.rollback();
			throw new SQLException("Erro ao inserir cadastro: " + e.getMessage(), e);
		}
	}

	private void atualizarCadastro(ModelCadastro objeto) throws SQLException {
		String sql = "UPDATE cadastro SET centrodecusto=?, funcao=?, nome=?, datanascimento=?, cpf=?, rg=?, aso=?, dataaso=?, filePath=? WHERE id=?";
		try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
			preparedStatement.setString(1, objeto.getCentrodecusto());
			preparedStatement.setString(2, objeto.getFuncao());
			preparedStatement.setString(3, objeto.getNome());
			preparedStatement.setString(4, objeto.getDatanascimento());
			preparedStatement.setString(5, objeto.getCpf());
			preparedStatement.setString(6, objeto.getRg());
			preparedStatement.setString(7, objeto.getAso());
			preparedStatement.setString(8, objeto.getDataaso());
			preparedStatement.setString(9, objeto.getFilePath()); // Adiciona o caminho do arquivo
			preparedStatement.setLong(10, objeto.getId());

			int rowsUpdated = preparedStatement.executeUpdate();
			if (rowsUpdated > 0) {
				System.out.println("Cadastro atualizado com sucesso!");
			}
			connection.commit();
		} catch (SQLException e) {
			connection.rollback();
			throw new SQLException("Erro ao atualizar cadastro: " + e.getMessage());
		}
	}

	public ModelCadastro consultaUsuario(String nome) throws SQLException {
		ModelCadastro model = new ModelCadastro();

		String sql = "SELECT * FROM cadastro WHERE upper(nome) = upper(?)";
		try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
			preparedStatement.setString(1, nome);

			ResultSet resultSet = preparedStatement.executeQuery();
			while (resultSet.next()) {
				model.setCentrodecusto(resultSet.getString("centrodecusto"));
				model.setFuncao(resultSet.getString("funcao"));
				model.setNome(resultSet.getString("nome"));
				model.setDatanascimento(resultSet.getString("datanascimento"));
				model.setCpf(resultSet.getString("cpf"));
				model.setRg(resultSet.getString("rg"));
				model.setAso(resultSet.getString("aso"));
				model.setDataaso(resultSet.getString("dataaso"));
				model.setFilePath(resultSet.getString("filePath"));
			}
		} catch (SQLException e) {
			e.printStackTrace();
			throw new SQLException("Erro ao consultar usuário: " + e.getMessage(), e);
		}
		return model;
	}


	public List<ModelCadastro> consultaUsuarioList() throws SQLException {
		List<ModelCadastro> retorno = new ArrayList<>();

		String sql = "SELECT * FROM cadastro";
		try (PreparedStatement statement = connection.prepareStatement(sql)) {
			ResultSet resultado = statement.executeQuery();

			while (resultado.next()) {
				ModelCadastro modelCadastro = new ModelCadastro();
				modelCadastro.setId(resultado.getLong("id"));
				modelCadastro.setCentrodecusto(resultado.getString("centrodecusto"));
				modelCadastro.setFuncao(resultado.getString("funcao"));
				modelCadastro.setNome(resultado.getString("nome"));
				modelCadastro.setDatanascimento(resultado.getString("datanascimento"));
				modelCadastro.setCpf(resultado.getString("cpf"));
				modelCadastro.setRg(resultado.getString("rg"));
				modelCadastro.setAso(resultado.getString("aso"));
				modelCadastro.setDataaso(resultado.getString("dataaso"));
				modelCadastro.setFilePath(resultado.getString("filePath"));

				retorno.add(modelCadastro);
			}
		} catch (SQLException e) {
			e.printStackTrace();
			throw new SQLException("Erro ao consultar lista de usuários: " + e.getMessage(), e);
		}
		return retorno;
	}

	public void deletarCadastro(String idUser) throws SQLException {
		String sql = "DELETE FROM cadastro WHERE id = ?";
		try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
			preparedStatement.setLong(1, Long.parseLong(idUser));
			preparedStatement.executeUpdate();
			connection.commit();
			System.out.println("Cadastro deletado com sucesso!");
		} catch (SQLException e) {
			connection.rollback();
			e.printStackTrace();
			throw new SQLException("Erro ao deletar cadastro: " + e.getMessage(), e);
		}
	}

	public ModelCadastro buscarCadastroPorId(long id) throws SQLException {
		ModelCadastro modelCadastro = null;
		String sql = "SELECT * FROM cadastro WHERE id = ?";

		try (PreparedStatement statement = connection.prepareStatement(sql)) {
			statement.setLong(1, id);
			try (ResultSet resultSet = statement.executeQuery()) {
				if (resultSet.next()) {
					modelCadastro = new ModelCadastro();
					modelCadastro.setId(resultSet.getLong("id"));
					modelCadastro.setCentrodecusto(resultSet.getString("centrodecusto"));
					modelCadastro.setFuncao(resultSet.getString("funcao"));
					modelCadastro.setNome(resultSet.getString("nome"));
					modelCadastro.setDatanascimento(resultSet.getString("datanascimento"));
					modelCadastro.setCpf(resultSet.getString("cpf"));
					modelCadastro.setRg(resultSet.getString("rg"));
					modelCadastro.setAso(resultSet.getString("aso"));
					modelCadastro.setDataaso(resultSet.getString("dataaso"));
					modelCadastro.setFilePath(resultSet.getString("filePath")); // Certifique-se de que o nome da coluna
																				// está correto
				}
			}
		}
		return modelCadastro;
	}
}
