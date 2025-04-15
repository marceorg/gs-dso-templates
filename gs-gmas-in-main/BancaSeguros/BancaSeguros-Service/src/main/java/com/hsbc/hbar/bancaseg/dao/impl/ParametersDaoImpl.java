/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.object.StoredProcedure;

import com.hsbc.hbar.bancaseg.dao.ParametersDao;
import com.hsbc.hbar.bancaseg.model.common.Compania;
import com.hsbc.hbar.bancaseg.model.common.ParSinEstado;
import com.hsbc.hbar.bancaseg.model.common.Parentesco;
import com.hsbc.hbar.bancaseg.model.common.TipoDoc;

public class ParametersDaoImpl implements ParametersDao {
	static Logger logger = LogManager.getLogger(ParametersDaoImpl.class);

	private DataSource dataSource;

	public void setDataSource(final DataSource datasource) {
		this.dataSource = datasource;
	}

	public DataSource getDataSource() {
		return this.dataSource;
	}

	public List<Compania> getCompaniaList() {
		try {
			SpBSParCompaniaSel sproc = new SpBSParCompaniaSel(this.dataSource);
			Map resCia = sproc.execute();
			return (List<Compania>) resCia.get("Resultado");
		} catch (Exception e) {
			ParametersDaoImpl.logger.error(e);
			return null;
		}
	}

	public class SpBSParCompaniaSel extends StoredProcedure {
		private static final String SPROC_NAME = "P_BS_PAR_COMPANIA_SEL";

		public SpBSParCompaniaSel(final DataSource dataSource) {
			super(dataSource, SpBSParCompaniaSel.SPROC_NAME);

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					Compania compania = new Compania();
					compania.setId(rs.getInt("COD_CIA"));
					compania.setName(rs.getString("DES_CIA"));
					compania.setEmail(rs.getString("DIR_MAI"));
					compania.setEjePoliza(rs.getString("EJE_POL"));
					compania.setEjeSiniestro(rs.getString("EJE_SIN"));
					compania.setRecemail(rs.getString("REC_MAI"));
					return compania;
				}
			}));
			compile();
		}

		public Map execute() {
			Map inpCia = new HashMap();
			return super.execute(inpCia);
		}
	}

	public List<TipoDoc> getTipoDocList() {
		try {
			SpBSParTipoDocSel sproc = new SpBSParTipoDocSel(this.dataSource);
			Map resTDo = sproc.execute();
			return (List<TipoDoc>) resTDo.get("Resultado");
		} catch (Exception e) {
			ParametersDaoImpl.logger.error(e);
			return null;
		}
	}

	public class SpBSParTipoDocSel extends StoredProcedure {
		private static final String SPROC_NAME = "P_BS_PAR_TIPODOC_SEL";

		public SpBSParTipoDocSel(final DataSource dataSource) {
			super(dataSource, SpBSParTipoDocSel.SPROC_NAME);

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					TipoDoc tipoDoc = new TipoDoc();
					tipoDoc.setId(rs.getInt("COD_TDO"));
					tipoDoc.setName(rs.getString("DES_TDO"));
					return tipoDoc;
				}
			}));
			compile();
		}

		public Map execute() {
			Map inpTDo = new HashMap();
			return super.execute(inpTDo);
		}
	}

	public List<ParSinEstado> getSinEstadoList() {
		try {
			SpBSParSinestadoSel sproc = new SpBSParSinestadoSel(this.dataSource);
			Map resSiE = sproc.execute();
			return (List<ParSinEstado>) resSiE.get("Resultado");
		} catch (Exception e) {
			ParametersDaoImpl.logger.error(e);
			return null;
		}
	}

	public class SpBSParSinestadoSel extends StoredProcedure {
		private static final String SPROC_NAME = "P_BS_PAR_SINESTADO_SEL";

		public SpBSParSinestadoSel(final DataSource dataSource) {
			super(dataSource, SpBSParSinestadoSel.SPROC_NAME);

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					ParSinEstado parSinEstado = new ParSinEstado();
					parSinEstado.setId(rs.getString("COD_EST"));
					parSinEstado.setName(rs.getString("DES_EST"));
					return parSinEstado;
				}
			}));
			compile();
		}

		public Map execute() {
			Map inpSiE = new HashMap();
			return super.execute(inpSiE);
		}
	}

	public List<Parentesco> getParentescoList() {
		try {
			SpBSParParentescoSel sproc = new SpBSParParentescoSel(this.dataSource);
			Map resPar = sproc.execute();
			return (List<Parentesco>) resPar.get("Resultado");
		} catch (Exception e) {
			ParametersDaoImpl.logger.error(e);
			return null;
		}
	}

	public class SpBSParParentescoSel extends StoredProcedure {
		private static final String SPROC_NAME = "P_BS_PAR_PARENTESCO_SEL";

		public SpBSParParentescoSel(final DataSource dataSource) {
			super(dataSource, SpBSParParentescoSel.SPROC_NAME);

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					Parentesco parentesco = new Parentesco();
					parentesco.setId(rs.getString("COD_PAR"));
					parentesco.setName(rs.getString("DES_PAR"));
					return parentesco;
				}
			}));
			compile();
		}

		public Map execute() {
			Map inpPar = new HashMap();
			return super.execute(inpPar);
		}
	}

	public List<String> getLogExec(final String param) {
		try {
			SpCILogExecSel sproc = new SpCILogExecSel(this.dataSource);
			Map resLEx = sproc.execute(param);
			return (List<String>) resLEx.get("Resultado");
		} catch (Exception e) {
			ParametersDaoImpl.logger.error(e);
			return null;
		}
	}

	public class SpCILogExecSel extends StoredProcedure {
		private static final String SPROC_NAME = "P_CI_LOG_EXEC_SEL";
		private static final String QRY_EXC = "QRY_EXC";

		public SpCILogExecSel(final DataSource dataSource) {
			super(dataSource, SpCILogExecSel.SPROC_NAME);
			declareParameter(new SqlParameter(SpCILogExecSel.QRY_EXC, Types.VARCHAR));

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					StringBuilder sBuf = new StringBuilder();
					for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
						sBuf.append(rs.getMetaData().getColumnName(i) + ":"
								+ rs.getString(rs.getMetaData().getColumnName(i)) + "^");
					}
					return sBuf.toString();
				}
			}));
			compile();
		}

		public Map execute(final String param) {
			Map inpLEx = new HashMap();
			inpLEx.put(SpCILogExecSel.QRY_EXC, param);
			return super.execute(inpLEx);
		}
	}

	public String getParamGral(final String param) {
		try {
			SpCIParParamGrlSel sproc = new SpCIParParamGrlSel(this.dataSource);
			Map resPGr = sproc.execute(param);
			List<String> idParamList = (List<String>) resPGr.get("Resultado");
			return idParamList.get(0);
		} catch (Exception e) {
			ParametersDaoImpl.logger.error(e);
			return null;
		}
	}

	public class SpCIParParamGrlSel extends StoredProcedure {
		private static final String SPROC_NAME = "P_CI_PAR_PARAMGRL_SEL";
		private static final String COD_PAR = "COD_PAR";

		public SpCIParParamGrlSel(final DataSource dataSource) {
			super(dataSource, SpCIParParamGrlSel.SPROC_NAME);
			declareParameter(new SqlParameter(SpCIParParamGrlSel.COD_PAR, Types.VARCHAR));

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					return rs.getString("PARVAL");
				}
			}));
			compile();
		}

		public Map execute(final String param) {
			Map inpPGr = new HashMap();
			inpPGr.put(SpCIParParamGrlSel.COD_PAR, param);
			return super.execute(inpPGr);
		}
	}
}
