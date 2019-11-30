<?xml version="1.0" encoding="UTF-8" standalone="yes"?>

<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                exclude-result-prefixes="*">

    <xsl:output method="xml"
                indent="yes"
                encoding="UTF-8"
            />
    <xsl:variable name="vLower" select="'abcdefghijklmnopqrstuvwxyz'"/>
    <xsl:variable name="vUpper" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
    <xsl:key name="country-by-continent" match="country" use="@continent" />
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
            <v t="{generate-id(/countries)}"><vh>Countries - Alphabetical List</vh>
                <xsl:apply-templates select="countries/country"/>
            </v>
            <v t="cc"><vh>Continents</vh>
                <xsl:apply-templates select="countries" mode="continent" />
            </v>
        </vnodes>
        <tnodes>
            <t tx="cc">Continents</t>
            <xsl:apply-templates select="countries/country" mode="tx" />
        </tnodes>
        </leo_file>
    </xsl:template>

    <xsl:template match="country">
        <v t="{generate-id(.)}">
            <vh><xsl:value-of select="normalize-space(.)"/> (<xsl:value-of select="@code"/>)</vh>
        </v>
    </xsl:template>

    <xsl:template match="country" mode="tx">
        <t tx="{generate-id(.)}"> </t>
    </xsl:template>

    <xsl:template match="countries" mode="continent">
        <xsl:for-each select="country[count(. | key('country-by-continent', @continent)[1]) = 1]">
            <xsl:sort select="@continent" />
            <v t="{generate-id(@continent)}">
                <vh>
                    <xsl:value-of
                            select="concat(translate(substring(@continent,1,1), $vLower, $vUpper),
                                          substring(@continent, 2),
                                          substring(' ', 1 div not(position()=last()))
                                          )" />
                </vh>
                <xsl:for-each select="key('country-by-continent', @continent)">
                    <xsl:sort select="." />
                    <v t="{generate-id(.)}">
                        <vh><xsl:value-of select="." /></vh>
                    </v>
                </xsl:for-each>
            </v>
        </xsl:for-each>
        </xsl:template>

    <xsl:template match="text()"></xsl:template>

</xsl:stylesheet>
