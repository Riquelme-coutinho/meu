import { Request, Response } from "express"
import AdminService from "../services/AdminService"

class AdminController {
  async dashboard(req: Request, res: Response) {
    try {
      const data = await AdminService.getDashboard();
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async funcoes(req: Request, res: Response) {
    try {
      const data = await AdminService.getFuncoes();
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async staff(req: Request, res: Response) {
    try {
      const data = await AdminService.getStaff();
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async createStaff(req: Request, res: Response) {
    try {
      const data = await AdminService.createStaff(req.body);
      return res.status(201).json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateStaff(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = await AdminService.updateStaff(id, req.body);
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteStaff(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await AdminService.deleteStaff(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async logs(req: Request, res: Response) {
    try {
      const data = await AdminService.getAuditLogs();
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async attendance(req: Request, res: Response) {
    try {
      const { document, tipo } = req.body;
      if (!document || !tipo) return res.status(400).json({ message: "Documento e tipo são obrigatórios" });
      const data = await AdminService.recordAttendance(document, tipo);
      return res.json(data);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getRecentAttendance(req: Request, res: Response) {
    try {
      const data = await AdminService.getRecentAttendance();
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAlunos(req: Request, res: Response) {
    try {
      const data = await AdminService.getAlunos();
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  
  async createAluno(req: Request, res: Response) {
    try {
      const { nome, idturma, idresponsaveis } = req.body;
      // idresponsaveis should be an array of numbers
      const responsaveisArray = Array.isArray(idresponsaveis) ? idresponsaveis.map(Number) : [];
      const data = await AdminService.createAluno(nome, Number(idturma), responsaveisArray);
      return res.status(201).json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateAluno(req: Request, res: Response) {
    try {
      const idaluno = Number(req.params.id);
      const { nome, matricula, idturma, idresponsaveis } = req.body;
      const aluno = await AdminService.updateAluno(idaluno, nome, matricula, idturma, idresponsaveis || []);
      return res.json(aluno);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteAluno(req: Request, res: Response) {
    try {
      const idaluno = Number(req.params.id);
      await AdminService.deleteAluno(idaluno);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getFamilias(req: Request, res: Response) {
    try {
      const data = await AdminService.getFamilias();
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  
  async createFamilia(req: Request, res: Response) {
    try {
      const { nome, cpf, celular } = req.body;
      const data = await AdminService.createFamilia(nome, cpf, celular);
      return res.status(201).json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateFamilia(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { nome, cpf, celular } = req.body;
      const data = await AdminService.updateFamilia(id, nome, cpf, celular);
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteFamilia(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await AdminService.deleteFamilia(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getTurmas(req: Request, res: Response) {
    try {
      const data = await AdminService.getTurmas();
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async createTurma(req: Request, res: Response) {
    try {
      const { codigoturma, capacidademaxima, idfuncionario } = req.body;
      const data = await AdminService.createTurma(codigoturma, Number(capacidademaxima) || 30, idfuncionario ? Number(idfuncionario) : undefined);
      return res.status(201).json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateTurma(req: Request, res: Response) {
    try {
      const idturma = Number(req.params.id);
      const { codigoturma, capacidademaxima, idfuncionario } = req.body;
      const data = await AdminService.updateTurma(idturma, codigoturma, Number(capacidademaxima) || 30, idfuncionario ? Number(idfuncionario) : undefined);
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteTurma(req: Request, res: Response) {
    try {
      const idturma = Number(req.params.id);
      await AdminService.deleteTurma(idturma);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getRotinas(req: Request, res: Response) {
    try {
      const data = await AdminService.getRotinas();
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async createRotina(req: Request, res: Response) {
    try {
      const { idaluno, idchecklist, rotinafeita, obsden_o } = req.body;
      const idfuncionario = req.idFuncionario;
      if (!idfuncionario) {
        return res.status(401).json({ message: "Usuário não autenticado como funcionário" });
      }
      const data = await AdminService.createRotina(Number(idaluno), Number(idchecklist), rotinafeita, obsden_o, idfuncionario);
      return res.status(201).json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async createRotinasBulk(req: Request, res: Response) {
    try {
      const { idchecklist, rotinas } = req.body;
      const idfuncionario = req.idFuncionario;
      if (!idfuncionario) {
        return res.status(401).json({ message: "Usuário não autenticado como funcionário" });
      }
      if (!Array.isArray(rotinas)) {
        return res.status(400).json({ message: "Formato inválido para rotinas em lote" });
      }
      const data = await AdminService.createRotinasBulk(Number(idchecklist), idfuncionario, rotinas);
      return res.status(201).json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getChecklists(req: Request, res: Response) {
    try {
      const data = await AdminService.getChecklists();
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }


  async getAvisos(req: Request, res: Response) {
    try {
      const data = await AdminService.getAvisos();
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async createAviso(req: Request, res: Response) {
    try {
      const { titulo, descricao, idturma, idresponsavel, idaluno } = req.body;
      
      if (idaluno) {
        // Enviar aviso para os responsáveis de um aluno específico
        const responsaveis = await AdminService.getResponsaveisByAluno(Number(idaluno));
        
        for (const resp of responsaveis) {
          await AdminService.createAviso(titulo, descricao, undefined, resp.idresponsavel);
        }
        return res.status(201).json({ message: 'Aviso enviado aos responsáveis do aluno.' });
      }

      const data = await AdminService.createAviso(titulo, descricao, idturma ? Number(idturma) : undefined, idresponsavel ? Number(idresponsavel) : undefined);
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new AdminController()
