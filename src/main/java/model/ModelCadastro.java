package model;

import java.io.Serializable;

public class ModelCadastro implements Serializable  {

	private static final long serialVersionUID = 1L;

	private Long id;
	private String centrodecusto;
	private String funcao;
	private String nome;
	private String datanascimento;
	private String cpf;
	private String rg;
	private String aso;
	private String dataaso;

	public boolean isNovo() {

		if (this.id == null) {
			return true;
		} else if (this.id != null && this.id > 0) {
			return false;
		}
		return this.id == null;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCentrodecusto() {
		return centrodecusto;
	}

	public void setCentrodecusto(String centrodecusto) {
		this.centrodecusto = centrodecusto;
	}

	public String getFuncao() {
		return funcao;
	}

	public void setFuncao(String funcao) {
		this.funcao = funcao;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getDatanascimento() {
		return datanascimento;
	}

	public void setDatanascimento(String datanascimento) {
		this.datanascimento = datanascimento;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getRg() {
		return rg;
	}

	public void setRg(String rg) {
		this.rg = rg;
	}

	public String getAso() {
		return aso;
	}

	public void setAso(String aso) {
		this.aso = aso;
	}

	public String getDataaso() {
		return dataaso;
	}

	public void setDataaso(String dataaso) {
		this.dataaso = dataaso;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	
	

}
