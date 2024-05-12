package connection;

import dao.DAOcadastro;
import model.ModelCadastro;

public class testeCodigo {
	
	public static void main(String[] args) throws Exception {
		
		
		/*ModelCadastro model = new ModelCadastro();
		
		model.setNome("Calebe Santiago");
		model.setFuncao("Gerente");
		
		DAOcadastro dao = new DAOcadastro();
		
		dao.gravarCadastro(model);*/
		
		ModelCadastro model = new ModelCadastro();
		DAOcadastro dao = new DAOcadastro();
		
		model.setId(2L);
		model.setNome("Manuela Santiago");
		model.setFuncao("Enfermeira");
		model.setCentrodecusto("Cheguevara");
		
		
		
		
		dao.gravarCadastro(model);
		
		
		
	}

}
