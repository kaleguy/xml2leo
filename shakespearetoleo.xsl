<?xml version="1.0" encoding="UTF-8" standalone="yes"?>

<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                exclude-result-prefixes="*">

    <xsl:output method="xml" indent="yes"
                encoding="UTF-8"
            />

    <xsl:template match="/">
        <leo_file xmlns:leo="http://leoeditor.com/namespaces/leo-python-editor/1.1" >
        <leo_header file_format="2" tnodes="0" max_tnode_index="0" clone_windows="0"/>
        <globals body_outline_ratio="0.5" body_secondary_ratio="0.5">
            <global_window_position top="50" left="50" height="500" width="700"/>
            <global_log_window_position top="0" left="0" height="0" width="0"/>
        </globals>
        <preferences/>
        <find_panel_settings/>
        <vnodes>
            <xsl:apply-templates mode="vnodes"/>
        </vnodes>
        <tnodes>
        </tnodes>
        </leo_file>
    </xsl:template>

    <!-- document properties .e.g title -->
    <xsl:template match="PLAY" mode="vnodes">
       properties : {
        <xsl:apply-templates/>
        },
    </xsl:template>
    <xsl:template match="head/*"><xsl:value-of select="local-name()"/>: '<xsl:value-of select="."/>',</xsl:template>

    <xsl:template match="body">
        items : [
        <xsl:apply-templates/>
        ],
    </xsl:template>
    <xsl:template match="toc">
        {
          type : 'toc',
          items : [
        <xsl:apply-templates/>
        ]
        },
    </xsl:template>
    <xsl:template match="item">{
          type : '<xsl:value-of select="@type"/>',
          style : '<xsl:value-of select="@style"/>',
          content : '<xsl:copy-of select="content"/>'
        },</xsl:template>

    <xsl:template match="text()"></xsl:template>

</xsl:stylesheet>
