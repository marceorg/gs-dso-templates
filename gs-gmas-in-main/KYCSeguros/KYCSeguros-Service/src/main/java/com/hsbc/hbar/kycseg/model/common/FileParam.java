package com.hsbc.hbar.kycseg.model.common;

public class FileParam {
	private String content;
	private String name;

	public FileParam(final String content, final String name) {
		this.content = content;
		this.name = name;
	}

	public String getContent() {
		return this.content;
	}

	public void setContent(final String content) {
		this.content = content;
	}

	public String getName() {
		return this.name;
	}

	public void setName(final String name) {
		this.name = name;
	}
}
