<?xml version="1.0" encoding="UTF-8" standalone="yes"?>

<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                exclude-result-prefixes="*">

    <xsl:output method="xml"
                indent="yes"
                encoding="UTF-8"
            />

    <xsl:template match="/">
        <xsl:text>
        </xsl:text>
        <leo_file xmlns:leo="http://leoeditor.com/namespaces/leo-python-editor/1.1" >
        <leo_header file_format="2" tnodes="0" max_tnode_index="0" clone_windows="0"/>
        <globals body_outline_ratio="0.5" body_secondary_ratio="0.5">
            <global_window_position top="50" left="50" height="500" width="700"/>
            <global_log_window_position top="0" left="0" height="0" width="0"/>
        </globals>
        <preferences/>
        <find_panel_settings/>
        <vnodes>
            <v t="{generate-id(/PLAY/TITLE)}">
                <vh><xsl:value-of select="/PLAY/TITLE"></xsl:value-of></vh>
                <xsl:apply-templates select="//PERSONAE"/>
                <xsl:apply-templates select="//ACT"/>
            </v>
        </vnodes>
        <tnodes>
            <xsl:apply-templates select="/PLAY/TITLE" mode="tx"/>
            <xsl:apply-templates select="//SCENE" mode="tx" />
        </tnodes>
        </leo_file>
    </xsl:template>

    <xsl:template match="PLAY/TITLE" mode="tx">
        <t tx="{generate-id(.)}">
            &lt;div class='ptitle' &gt;<xsl:value-of select="."/>&lt;/div&gt;<xsl:apply-templates select="//FM/P"/></t></xsl:template>

    <xsl:template match="P">&lt;div class='pdetail' &gt;<xsl:value-of select="."/>&lt;/div&gt;
    </xsl:template>
    <xsl:template match="PERSONAE">
       <v t="{generate-id(.)}"><vh>Dramatis Personae</vh>
           <xsl:apply-templates />
       </v>
    </xsl:template>
    <xsl:template match="PERSONA">
        <v t="{generate-id(.)}"><vh><xsl:value-of select="normalize-space(.)"/></vh></v>
    </xsl:template>
    <xsl:template match="ACT">
        <v t="{generate-id(.)}"><vh><xsl:apply-templates select="TITLE"/></vh><xsl:apply-templates select="SCENE"/></v>
    </xsl:template>
    <xsl:template match="TITLE"><xsl:value-of select="normalize-space(.)"/></xsl:template>
    <xsl:template match="SCENE">
        <v t="{generate-id(.)}"><vh><xsl:apply-templates select="TITLE"/></vh></v>
    </xsl:template>
    <xsl:template match="SCENE" mode="tx">
        <t tx="{generate-id(.)}">@language html
            <xsl:apply-templates select="SPEECH|LINE|STAGEDIR"/>
        </t>
    </xsl:template>
    <xsl:template match="SPEAKER">&lt;div class='speaker' &gt;<xsl:value-of select="."/>&lt;/div&gt;
    </xsl:template>
    <xsl:template match="LINE">&lt;div class='line' &gt;<xsl:value-of select="."/>&lt;/div&gt;
    </xsl:template>
    <xsl:template match="STAGEDIR">&lt;div class='stagedir' &gt;<xsl:value-of select="."/>&lt;/div&gt;
    </xsl:template>

    <xsl:template match="text()"></xsl:template>

</xsl:stylesheet>
