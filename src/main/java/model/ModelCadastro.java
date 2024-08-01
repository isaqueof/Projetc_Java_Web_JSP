package model;

import org.springframework.data.annotation.Id;

public class ModelCadastro {
	@Id
    private Long id;
    private String centrodecusto;
    private String funcao;
    private String nome;
    private String datanascimento;
    private String cpf;
    private String rg;
    private String aso;
    private String dataaso;
    private String filePath;
    private String fileName;

      

    public Long getId() {
        return id;
    }

    public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
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

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public boolean isNovo() {
        return this.id == null;
    }
}
