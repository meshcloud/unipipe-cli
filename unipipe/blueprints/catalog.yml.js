export const catalog = 
`services:
  # define a simple service offering
  # for field documentation see https://github.com/openservicebrokerapi/servicebroker/blob/v2.15/spec.md#service-offering-object
  - id: g40133dd-8373-4c25-8014-fde98f38a729 # this must be a UUID, generate e.g. via "unipipe generate uuid"
    name: "Webservice-api"
    description: "This service spins up a webservice in aws."
    bindable: true
    tags:
      - "example"
    plans: 
      # service offerings can come in one or multiple plans
      # here we define plans in different t-shirt sizes
      - id: "b13edcdf-eb54-44d3-8902-8f24d5acb07e"
        name: "S"
        description: "A t2.nano instance"
        free: true
        bindable: true
        schemas: # schemas define the configuration options offered by a plan
          service_instance:
            create:
              parameters:
                "$schema": http://json-schema.org/draft-04/schema#
                properties:
                  username:
                    title: username
                    type: string

      - id: "c387b010-c002-4eab-8902-3851694ef7ba"
        name: "M"
        description: "A t2.micro instance"
        free: true
        bindable: true
        schemas:
          service_instance:
            create:
              parameters:
                "$schema": http://json-schema.org/draft-04/schema#
                properties:
                  username:
                    title: username
                    type: string

  # a more complex service example
  - id: "22e1bbf3-b425-46cd-a03e-927f73abcaaf"
    name: "Azure DevOps"
    description: "Onboard your team to Azure DevOps services"
    bindable: false
    plan_updateable: true
    instances_retrievable: true
    bindings_retrievable: false
    metadata:
      displayName: "Azure DevOps"
      imageUrl: "https://docs.microsoft.com/en-us/azure/devops/media/index/devopsiconpipelines96.svg?view=azure-devops"
      longDescription: "Azure DevOps services"
      providerDisplayName: "Azure"
      documentationUrl: "https://docs.microsoft.com/en-us/azure/devops/?view=azure-devops"
      supportUrl: "https://azure.microsoft.com/en-us/services/devops/"
    tags:
      - "azure"
      - "devops"
    plans:
      - id: "1c5c4f4d-bde5-4030-9874-b096fd3f78c5"
        name: "Full Team Onboarding plan"
        description: "Enable all user in your meshProject on Azure DevOps."
        free: false
        metadata:
          bullets:
            - bulletpoint 1
            - bulletpoint 2
          costs:
            - amount:
                eur: 99.99
              unit: MONTHLY
            - amount:
                eur: 100.00
              unit: SETUP FEE # setup fees as supported by meshMarketplace https://docs.meshcloud.io/docs/meshstack.meshmarketplace.metering.html#setup-fees
          displayName: Fullteam plan
        schemas:
          service_instance:
            create:
              parameters:
                $schema: http://json-schema.org/draft-04/schema#
                properties:
                  projectname:
                    description: "Project name"
                    type: "string"
                  projectdescription:
                    description: "Project describtion"
                    type: "string"
                  msteamsad:
                    type: string
                    title: MS Teams AD
                    description: Select the correct ms teams ad
                    enum:
                      - DEV
                      - TEST
                      - PROD
                    widget: select
                  email:
                    description: "E-mail address"
                    type: "string"
                type: object
            update:
              parameters:
                $schema: http://json-schema.org/draft-04/schema#
                properties:
                  projectname:
                    description: "Project name"
                    type: "string"
                  projectdescription:
                    description: "Project describtion"
                    type: "string"
                  msteamsad:
                    description: "MS Teams AD group"
                    type: "string"
                  email:
                    description: "E-mail address"
                    type: "string"
                type: object

  # a example for a network tenant service
  - id: 15et89a-4kl-8373-4c25-123-fde90f64tra4
    name: Azure VNet
    description: Provides a configurable default VNet in your Azure subscription.
    bindable: false
    plan_updateable: false
    instances_retrievable: true
    bindings_retrievable: false
    plans:
      - id: bj2l4i-46as-44d3-7891-8f24d5hksa5w
        name: default
        description: Standard vNet
        free: true
        schemas:
          service_instance:
            create:
              parameters:
                "$schema": http://json-schema.org/draft-04/schema#
                properties:
                  count_of_leading_1_bits_in_the_routing_mask:
                    title: size of vNet
                    type: string
                    widget:
                      id: select
                    default: "28"
                    oneOf:
                      - description: /27 vNet with 11 addresses (+5 addresses reserved by Azure)
                        enum:
                          - "27"
                      - description: /26 vNet with 27 addresses (+5 addresses reserved by Azure)
                        enum:
                          - "26"
                      - description: /25 vNet with 61 addresses (+5 addresses reserved by Azure)
                        enum:
                          - "25"
                      - description: /24 vNet with 123 addresses (+5 addresses reserved by Azure)
                        enum:
                          - "24"
                      - description: /23 vNet with 251 addresses (+5 addresses reserved by Azure)
                        enum:
                          - "23"
                  VNetRegion:
                    title: vNet Region
                    type: string
                    widget:
                      id: select
                    default: "GermanyWestCentral"
                    oneOf:
                      - description: GermanyWestCentral (default choice)
                        enum:
                          - "GermanyWestCentral"
                      - description: WestEurope
                        enum:
                          - "WestEurope"
`;
