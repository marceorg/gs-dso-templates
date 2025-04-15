/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2018. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.filerepo.dao.impl;

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

import com.hsbc.hbar.filerepo.dao.ParametersDao;

public class ParametersDaoImpl implements ParametersDao {
	static Logger logger = LogManager.getLogger(ParametersDaoImpl.class);

	private DataSource dataSource;

	public void setDataSource(final DataSource datasource) {
		this.dataSource = datasource;
	}

	public DataSource getDataSource() {
		return this.dataSource;
	}

	public String getParamGral(final String param) {
		try {
			SpCIParParamGrlSel sproc = new SpCIParParamGrlSel(this.dataSource);
			Map results = sproc.execute(param);
			List<String> idParamList = (List<String>) results.get("Resultado");
			return idParamList.get(0);
		} catch (Exception e) {
			ParametersDaoImpl.logger.error(e);
			return null;
		}
	}

	public class SpCIParParamGrlSel extends StoredProcedure {
		private static final String SPROC_NAME = "P_CI_PAR_PARAMGRL_SEL";
		private static final String PARAM1 = "COD_PAR";

		public SpCIParParamGrlSel(final DataSource dataSource) {
			super(dataSource, SpCIParParamGrlSel.SPROC_NAME);
			declareParameter(new SqlParameter(SpCIParParamGrlSel.PARAM1, Types.VARCHAR));

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					String brokerId = rs.getString("PARVAL");
					return brokerId;
				}
			}));
			compile();
		}

		public Map execute(final String param) {
			Map inputs = new HashMap();
			inputs.put(SpCIParParamGrlSel.PARAM1, param);
			return super.execute(inputs);
		}
	}
}