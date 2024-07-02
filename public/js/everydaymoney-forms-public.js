function EverydayMoneyConfig() {

  this.DEFAULT_PERCENTAGE = 0;
  this.DEFAULT_ADDITIONAL_CHARGE = 0;
  this.DEFAULT_THRESHOLD = 0;
  this.DEFAULT_CAP = 0;
  this.LIVE_MODE = false;

  this.__initialize = function () {

    this.percentage = this.DEFAULT_PERCENTAGE;
    this.additional_charge = this.DEFAULT_ADDITIONAL_CHARGE;
    this.threshold = this.DEFAULT_THRESHOLD;
    this.cap = this.DEFAULT_CAP;
    this.liveMode = this.LIVE_MODE;

    if (window && window.EVERYDAYMONEY_SETTINGS) {
      this.liveMode = window.EVERYDAYMONEY_SETTINGS.liveMode;
    }

  }

  this.chargeDivider = 0;
  this.crossover = 0;
  this.flatlinePlusCharge = 0;
  this.flatline = 0;

  this.withPercentage = function (percentage) {
    this.percentage = percentage;
    this.__setup();
  };

  this.withAdditionalCharge = function (additional_charge) {
    this.additional_charge = additional_charge;
    this.__setup();
  };

  this.withThreshold = function (threshold) {
    this.threshold = threshold;
    this.__setup();
  };

  this.withCap = function (cap) {
    this.cap = cap;
    this.__setup();
  };

  this.__setup = function () {
    this.__initialize();
    this.chargeDivider = this.__chargeDivider();
    this.crossover = this.__crossover();
    this.flatlinePlusCharge = this.__flatlinePlusCharge();
    this.flatline = this.__flatline();
  };

  this.__chargeDivider = function () {
    return 1 - this.percentage;
  };

  this.__crossover = function () {
    return this.threshold * this.chargeDivider - this.additional_charge;
  };

  this.__flatlinePlusCharge = function () {
    return (this.cap - this.additional_charge) / this.percentage;
  };

  this.__flatline = function () {
    return this.flatlinePlusCharge - this.cap;
  };

  this.addFor = function (amountinkobo) {
    if (amountinkobo > this.flatline) {
      return parseInt(Math.round(amountinkobo + this.cap));
    } else if (amountinkobo > this.crossover) {
      return parseInt(
        Math.round((amountinkobo + this.additional_charge) / this.chargeDivider)
      );
    } else {
      return parseInt(Math.round(amountinkobo / this.chargeDivider));
    }
  };

  this.__setup = function () {
    this.chargeDivider = this.__chargeDivider();
    this.crossover = this.__crossover();
    this.flatlinePlusCharge = this.__flatlinePlusCharge();
    this.flatline = this.__flatline();
  };

  this.__setup();
}

(function ($) {
  "use strict";
  $(document).ready(function ($) {
    $(function () {
      if ($(".date-picker").length > 0) {
        $(".date-picker").datepicker({
          dateFormat: "mm/dd/yy",
          prevText: '<i class="fa fa-caret-left"></i>',
          nextText: '<i class="fa fa-caret-right"></i>'
        });
      }
    });
    if ($("#emf-vamount").length) {
      var amountField = $("#emf-vamount");
      calculateTotal();
    } else {
      var amountField = $("#emf-amount");
    }
    var max = 10;
    amountField.keydown(function (e) {
      format_validate(max, e);
    });

    amountField.keyup(function (e) {
      checkMinimumVal();
    });

    function checkMinimumVal() {
      if ($("#emf-minimum-hidden").length) {
        var min_amount = Number($("#emf-minimum-hidden").val());
        var amt = Number($("#emf-amount").val());
        if (min_amount > 0 && amt < min_amount) {
          $("#emf-min-val-warn").text(
            "Amount cannot be less than the minimum amount"
          );
          return false;
        } else {
          $("#emf-min-val-warn").text("");
          $("#emf-amount").removeClass("rerror");
        }
      }
    }

    function format_validate(max, e) {
      var value = amountField.text();
      if (e.which != 8 && value.length > max) {
        e.preventDefault();
      }
      // Allow: backspace, delete, tab, escape, enter and .
      if (
        $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.keyCode == 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+X
        (e.keyCode == 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)
      ) {
        // let it happen, don't do anything
        calculateFees();
        return;
      }
      // Ensure that it is a number and stop the keypress
      if (
        (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
        (e.keyCode < 96 || e.keyCode > 105)
      ) {
        e.preventDefault();
      } else {
        calculateFees();
      }
    }

    $.fn.digits = function () {
      return this.each(function () {
        $(this).text(
          $(this)
            .text()
            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
        );
      });
    };

    function calculateTotal() {
      var unit;
      if ($("#emf-vamount").length) {
        unit = $("#paystack-form").find("#emf-vamount").val();
      } else {
        unit = $("#emf-amount").val();
      }
      var quant = $("#emf-quantity").val();
      var newvalue = unit * quant;

      if (quant == "" || quant == null) {
        quant = 1;
      } else {
        $("#emf-total").val(newvalue);
      }
    }
    function calculateFees(transaction_amount) {
      setTimeout(function () {
        transaction_amount = transaction_amount || parseInt(amountField.val());
        var currency = $("#emf-currency").val();
        var quant = $("#emf-quantity").val();
        if ($("#emf-vamount").length) {
          var name = $("#emf-vamount option:selected").attr("data-name");
          $("#emf-vname").val(name);
        }
        if (
          transaction_amount == "" ||
          transaction_amount == 0 ||
          transaction_amount.length == 0 ||
          transaction_amount == null ||
          isNaN(transaction_amount)
        ) {
          var total = 0;
          var fees = 0;
        } else {
          var obj = new EverydayMoneyConfig();

          obj.withAdditionalCharge(0);
          obj.withThreshold(0);
          obj.withCap(0);
          obj.withPercentage(0);
          if (quant) {
            transaction_amount = transaction_amount * quant;
          }
          var total = obj.addFor(transaction_amount * 100) / 100;
          var fees = total - transaction_amount;
        }
        $(".emf-txncharge")
          .hide()
          .html(currency + " " + fees.toFixed(2))
          .show()
          .digits();
        $(".emf-txntotal")
          .hide()
          .html(currency + " " + total.toFixed(2))
          .show()
          .digits();
      }, 100);
    }

    calculateFees();

    $(".emf-number").keydown(function (event) {
      if (
        event.keyCode == 46 ||
        event.keyCode == 8 ||
        event.keyCode == 9 ||
        event.keyCode == 27 ||
        event.keyCode == 13 ||
        (event.keyCode == 65 && event.ctrlKey === true) ||
        (event.keyCode >= 35 && event.keyCode <= 39)
      ) {
        return;
      } else {
        if (
          event.shiftKey ||
          ((event.keyCode < 48 || event.keyCode > 57) &&
            (event.keyCode < 96 || event.keyCode > 105))
        ) {
          event.preventDefault();
        }
      }
    });
    if ($("#emf-quantity").length) {
      calculateTotal();
    };

    $("#emf-quantity, #emf-vamount, #emf-amount").on("change", function () {
      calculateTotal();
      calculateFees();
    });

    function validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
    $(".everydaymoney-form").on(
      "submit", function (e) {
        var requiredFieldIsInvalid = false;
        e.preventDefault();

        $("#emf-agreementicon").removeClass("rerror");

        $(this)
          .find("input, select, textarea")
          .each(
            function () {
              $(this).removeClass("rerror"); //.css({ "border-color":"#d1d1d1" });
            }
          );
        var email = $(this)
          .find("#emf-email")
          .val();
        var amount;
        if ($("#emf-vamount").length) {
          amount = $("#paystack-form").find("#emf-vamount").val();
          calculateTotal();
        } else {
          amount = $(this)
            .find("#emf-amount")
            .val();
        }
        // if (Number(amount) > 0) {
        // } else {
        //   $(this)
        //     .find("#emf-amount,#emf-vamount")
        //     .addClass("rerror"); //  css({ "border-color":"red" });
        //   $("html,body").animate(
        //     { scrollTop: $(".rerror").offset().top - 110 },
        //     500
        //   );
        //   return false;
        // }
        if (!validateEmail(email)) {
          $(this)
            .find("#emf-email")
            .addClass("rerror"); //.css({ "border-color":"red" });
          $("html,body").animate(
            { scrollTop: $(".rerror").offset().top - 110 },
            500
          );
          return false;
        }
        if (checkMinimumVal() == false) {
          $(this)
            .find("#emf-amount")
            .addClass("rerror"); //.css({ "border-color":"red" });
          $("html,body").animate(
            { scrollTop: $(".rerror").offset().top - 110 },
            500
          );
          return false;
        }

        $(this)
          .find("input, select, text, textarea")
          .filter("[required]")
          .filter(
            function () {
              return this.value === "";
            }
          )
          .each(
            function () {
              $(this).addClass("rerror");
              requiredFieldIsInvalid = true;
            }
          );

        if ($("#emf-agreement").length && !$("#emf-agreement").is(":checked")) {
          $("#emf-agreementicon").addClass("rerror");
          requiredFieldIsInvalid = true;
        }

        if (requiredFieldIsInvalid) {
          $("html,body").animate(
            { scrollTop: $(".rerror").offset().top - 110 },
            500
          );
          return false;
        }

        var self = $(this);
        var $form = $(this);

        $.blockUI({ message: "Please wait..." });

        var formdata = new FormData(this);

        $.ajax(
          {
            url: $form.attr("action"),
            type: "POST",
            data: formdata,
            mimeTypes: "multipart/form-data",
            contentType: false,
            cache: false,
            processData: false,
            dataType: "JSON",
            success: function (data) {
              $.unblockUI();
              if (!data.isError) {
                  // var obj = new EverydayMoneyConfig();
                  // console.log({obj});
                  if(window.EVERYDAYMONEY_SETTINGS.liveMode){
                    window.location.href = `https://checkout.everydaymoney.app?methods=bank_transfer,card&transactionRef=${data.result.transactionRef}`;
                  }else{
                    window.location.href = `https://di0yljy1dvrl5.cloudfront.net/?methods=bank_transfer,card&transactionRef=${data.result.transactionRef}`;
                  }
              } else {
                alert(data.result);
              }
            },
            error: function (xhr, status, error) {
              console.log("An error occurred");
              console.log("XHR: ", xhr);
              console.log("Status: ", status);
              console.log("Error: ", error);
            }
          }
        );
      }
    );

    $(".retry-form").on(
      "submit", function (e) {
        var self = $(this);
        var $form = $(this);
        e.preventDefault();

        $.blockUI({ message: "Please wait..." });

        var formdata = new FormData(this);

        $.ajax(
          {
            url: $form.attr("action"),
            type: "POST",
            data: formdata,
            mimeTypes: "multipart/form-data",
            contentType: false,
            cache: false,
            processData: false,
            dataType: "JSON",
            success: function (data) {
              $.unblockUI();
              if (!data.isError) {
                var obj = new EverydayMoneyConfig();
                if(obj.liveMode){
                  window.location.href = `https://checkout.everydaymoney.app?methods=bank_transfer,card&transactionRef=${data.result.transactionRef}`;
                }else{
                  window.location.href = `https://di0yljy1dvrl5.cloudfront.net/?methods=bank_transfer,card&transactionRef=${data.result.transactionRef}`;
                }
              } else {
                alert(data.result);
              }
            },
            error: function (xhr, status, error) {
              console.log("An error occurred");
              console.log("XHR: ", xhr);
              console.log("Status: ", status);
              console.log("Error: ", error);
            }
          }
        );
      }
    );
  });
})(jQuery);
